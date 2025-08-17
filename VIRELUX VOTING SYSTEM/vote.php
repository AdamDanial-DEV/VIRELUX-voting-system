<?php
require_once '../db_connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $candidateId = $data['candidateId'];
    
    try {
        // Semak status pengundian
        $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'voting_status'");
        $status = $stmt->fetchColumn();
        
        if ($status !== 'open') {
            echo json_encode(['status' => 'error', 'message' => 'Voting is closed']);
            exit;
        }
        
        // Tambah undian
        $stmt = $pdo->prepare("UPDATE candidates SET votes = votes + 1 WHERE id = ?");
        $stmt->execute([$candidateId]);
        
        echo json_encode(['status' => 'success']);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
}
?>