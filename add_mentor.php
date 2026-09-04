<?php
require_once 'db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $emp_id = $_POST['emp_id'] ?? '';
    $department = $_POST['department'] ?? '';
    $designation = $_POST['designation'] ?? '';
    $max_mentees = intval($_POST['max_mentees'] ?? 0);

    if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(["status" => "error", "message" => "Please upload a valid photo file."]);
        exit;
    }

    $upload_dir = 'uploads/';
    
    // Ensure folder exists and force full write permissions
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    @chmod($upload_dir, 0777);

    $file_extension = strtolower(pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION));
    $file_name = time() . '_' . uniqid() . '.' . $file_extension;
    $target_file = $upload_dir . $file_name;

    if (move_uploaded_file($_FILES['photo']['tmp_name'], $target_file)) {
        @chmod($target_file, 0644);
        
        $stmt = $conn->prepare("INSERT INTO mentors (name, emp_id, department, designation, max_mentees, photo) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssis", $name, $emp_id, $department, $designation, $max_mentees, $target_file);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Mentor added successfully!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Employee ID already exists or DB Error."]);
        }
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Could not write to uploads folder. Check folder permissions."]);
    }
}
$conn->close();
?>