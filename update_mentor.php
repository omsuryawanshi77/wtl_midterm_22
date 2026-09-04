<?php
require_once 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = intval($_POST['id'] ?? 0);
    $name = $_POST['name'] ?? '';
    $emp_id = $_POST['emp_id'] ?? '';
    $department = $_POST['department'] ?? '';
    $designation = $_POST['designation'] ?? '';
    $max_mentees = intval($_POST['max_mentees'] ?? 0);

    if ($id <= 0) {
        echo json_encode(["status" => "error", "message" => "Invalid ID"]);
        exit;
    }

    // Check if new photo was uploaded
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === 0) {
        $upload_dir = "uploads/";
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        $file_extension = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
        $target_file = $upload_dir . time() . '_' . uniqid() . '.' . $file_extension;

        if (move_uploaded_file($_FILES['photo']['tmp_name'], $target_file)) {
            $stmt = $conn->prepare("UPDATE mentors SET name=?, emp_id=?, department=?, designation=?, max_mentees=?, photo=? WHERE id=?");
            $stmt->bind_param("ssssisi", $name, $emp_id, $department, $designation, $max_mentees, $target_file, $id);
        }
    } else {
        $stmt = $conn->prepare("UPDATE mentors SET name=?, emp_id=?, department=?, designation=?, max_mentees=? WHERE id=?");
        $stmt->bind_param("ssssii", $name, $emp_id, $department, $designation, $max_mentees, $id);
    }

    if (isset($stmt) && $stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Mentor updated successfully!"]);
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update record."]);
    }
}
$conn->close();
?>