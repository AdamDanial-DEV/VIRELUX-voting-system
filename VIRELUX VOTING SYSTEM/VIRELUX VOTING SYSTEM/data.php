<?php
// data.php - Backend API for SMKDOB Voting System

// Enable CORS for development
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
// ...existing code...

// Database configuration
require_once 'db_connect.php';

// Main routing
$request_uri = $_SERVER['REQUEST_URI'];
$endpoint = str_replace('/api/', '', parse_url($request_uri, PHP_URL_PATH));

switch ($endpoint) {
    case 'candidates':
        handleCandidates();
        break;
    case 'settings':
        handleSettings();
        break;
    case 'vote':
        handleVote();
        break;
    default:
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Endpoint not found']);
        break;
}

// Handle candidates operations
function handleCandidates() {
    global $pdo;
    
    $method = $_SERVER['REQUEST_METHOD'];
    $id = $_GET['id'] ?? null;
    $reset = isset($_GET['reset']) ? (int)$_GET['reset'] : 0;

    try {
        if ($method === 'GET') {
            if ($reset === 1) {
                // Reset all votes
                $stmt = $pdo->prepare("UPDATE candidates SET votes = 0");
                $stmt->execute();
                echo json_encode(['status' => 'success']);
                return;
            }

            // Get all candidates
            $stmt = $pdo->query("SELECT * FROM candidates ORDER BY votes DESC");
            $candidates = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($candidates);
        } 
        elseif ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if ($id) {
                // Update candidate
                $stmt = $pdo->prepare("UPDATE candidates SET name = ?, class = ?, vision = ?, image = ? WHERE id = ?");
                $stmt->execute([
                    $data['name'],
                    $data['class'],
                    $data['vision'],
                    $data['image'],
                    $id
                ]);
                echo json_encode(['status' => 'success']);
            } else {
                // Add new candidate
                $stmt = $pdo->prepare("INSERT INTO candidates (name, class, vision, image, votes) VALUES (?, ?, ?, ?, 0)");
                $stmt->execute([
                    $data['name'],
                    $data['class'],
                    $data['vision'],
                    $data['image'] ?? 'https://via.placeholder.com/300x200?text=Candidate+Image'
                ]);
                echo json_encode(['status' => 'success', 'id' => $pdo->lastInsertId()]);
            }
        }
        elseif ($method === 'DELETE') {
            // Delete candidate
            $stmt = $pdo->prepare("DELETE FROM candidates WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
}

// Handle system settings
function handleSettings() {
    global $pdo;
    
    $method = $_SERVER['REQUEST_METHOD'];
    $key = $_GET['key'] ?? null;

    try {
        if ($method === 'GET') {
            // Get all settings
            $stmt = $pdo->query("SELECT * FROM settings");
            $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $result = [];
            foreach ($settings as $setting) {
                $result[$setting['setting_key']] = $setting['setting_value'];
            }
            
            // Default settings if not in DB
            $defaults = [
                'voting_status' => 'open',
                'voting_password' => 'SMKDOB',
                'announcement' => 'Welcome to SMKDOB Voting System!'
            ];
            
            $result = array_merge($defaults, $result);
            echo json_encode($result);
        } 
        elseif ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Check if setting exists
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM settings WHERE setting_key = ?");
            $stmt->execute([$data['key']]);
            $exists = $stmt->fetchColumn();
            
            if ($exists) {
                // Update existing setting
                $stmt = $pdo->prepare("UPDATE settings SET setting_value = ? WHERE setting_key = ?");
                $stmt->execute([$data['value'], $data['key']]);
            } else {
                // Add new setting
                $stmt = $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)");
                $stmt->execute([$data['key'], $data['value']]);
            }
            
            echo json_encode(['status' => 'success']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
}

// Handle voting
function handleVote() {
    global $pdo;
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $candidateId = $data['candidateId'] ?? null;
        
        try {
            // Check voting status
            $stmt = $pdo->prepare("SELECT setting_value FROM settings WHERE setting_key = 'voting_status'");
            $stmt->execute();
            $status = $stmt->fetchColumn();
            
            if ($status !== 'open') {
                http_response_code(403);
                echo json_encode(['status' => 'error', 'message' => 'Voting is currently closed']);
                return;
            }
            
            // Record vote
            $stmt = $pdo->prepare("UPDATE candidates SET votes = votes + 1 WHERE id = ?");
            $stmt->execute([$candidateId]);
            
            echo json_encode(['status' => 'success']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}

?>