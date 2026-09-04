<?php
require_once 'db.php';

header('Content-Type: application/json');

$sql = "SELECT * FROM mentors ORDER BY id DESC";
$result = $conn->query($sql);

$mentors = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $mentors[] = $row;
    }
}

echo json_encode($mentors);
$conn->close();
?>