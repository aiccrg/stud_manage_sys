<?php
$servername = "localhost"; // or your server address
$username = "root"; // your MySQL username
$password = ""; // your MySQL password
$dbname = "student_management"; // the database name you created

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
?>
