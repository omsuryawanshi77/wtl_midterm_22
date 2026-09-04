<?php
require_once 'db.php';

header('Content-Type: application/json');

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);

    // Retrieve photo path to clean up uploaded file
    $stmt = $conn->prepare("SELECT photo FROM mentors WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        if (file_exists($row['photo'])) {
            unlink($row['photo']);
        }
    }
    $stmt->close();

    // Delete record from database
    $deleteStmt = $conn->prepare("DELETE FROM mentors WHERE id = ?");
    $deleteStmt->bind_param("i", $id);

    if ($deleteStmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Mentor deleted successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Delete failed."]);
    }
    $deleteStmt->close();
}
$conn->close();
?>