<?php
$host = "sql201.infinityfree.com";
$user = "if0_42833308";
$password = "q5i2VtiU7AZScQ"; // Replace with password from eye icon
$database = "if0_42833308_mentor_db";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}
?>