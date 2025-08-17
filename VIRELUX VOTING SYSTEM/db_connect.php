<?php
$host = 'localhost';
$dbname = 'smkdob_voting';
$username = 'username_database_anda';  // Ganti dengan username MySQL
$password = 'password_database_anda';  // Ganti dengan password MySQL

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ATTR_ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Could not connect to the database $dbname :" . $e->getMessage());
}