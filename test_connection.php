<?php
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
?>
