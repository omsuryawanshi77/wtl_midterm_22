<?php
require_once 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = intval($_POST['id'] ?? 0);
    $name = trim($_POST['name'] ?? '');
    $emp_id = trim($_POST['emp_id'] ?? '');
    $department = trim($_POST['department'] ?? '');
    $designation = trim($_POST['designation'] ?? '');
    $max_mentees = intval($_POST['max_mentees'] ?? 0);

    if ($id <= 0) {
        echo json_encode(["status" => "error", "message" => "Invalid Mentor ID."]);
        exit;
    }

    if ($name === '' || $emp_id === '' || $department === '' || $designation === '' || $max_mentees <= 0) {
        echo json_encode(["status" => "error", "message" => "Please fill in all required fields."]);
        exit;
    }

    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = 'uploads/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        $file_extension = strtolower(pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION));
        $file_name = time() . '_' . uniqid() . '.' . $file_extension;
        $target_file = $upload_dir . $file_name;

        if (move_uploaded_file($_FILES['photo']['tmp_name'], $target_file)) {
            $stmt = $conn->prepare("UPDATE mentors SET name=?, emp_id=?, department=?, designation=?, max_mentees=?, photo=? WHERE id=?");
            $stmt->bind_param("ssssisi", $name, $emp_id, $department, $designation, $max_mentees, $target_file, $id);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to upload photo."]);
            exit;
        }
    } else {
        $stmt = $conn->prepare("UPDATE mentors SET name=?, emp_id=?, department=?, designation=?, max_mentees=? WHERE id=?");
        $stmt->bind_param("ssssii", $name, $emp_id, $department, $designation, $max_mentees, $id);
    }

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Mentor updated successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Database error: " . $stmt->error]);
    }
    $stmt->close();
}
$conn->close();
?>
