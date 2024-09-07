<?php
include 'db.php'; // include your database connection script

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullname = $_POST['fullname'];
    $email = $_POST['email'];
    $age = $_POST['age'];
    $class = $_POST['class'];

    $stmt = $conn->prepare("INSERT INTO students (fullname, email, age, class) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssis", $fullname, $email, $age, $class);

    if ($stmt->execute()) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
