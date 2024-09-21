<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();

$newName = $inData["Name"];
$newPhone = $inData["phone"];
$newEmail = $inData["email"];
$iD = (int)$inData["ID"];  // Ensure ID is cast to integer

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Debug: Log if prepare statement fails
    $stmt = $conn->prepare("UPDATE Contacts SET Name = ?, phone = ?, email = ? WHERE ID = ?");
    if (!$stmt) {
        returnWithError("Prepare failed: " . $conn->error);
        exit();
    }
    
    $stmt->bind_param("sssi", $newName, $newPhone, $newEmail, $iD);
    
    if ($stmt->execute()) {
        // Check if the update affected any rows
        if ($stmt->affected_rows > 0) {
            returnWithInfo("Contact edited successfully");
        } else {
            returnWithError("No contact found with the provided ID");
        }
    } else {
        returnWithError("Error executing query: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function returnWithError($err) {
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($info) {
    $retValue = '{"info":"' . $info . '"}';
    sendResultInfoAsJson($retValue);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}
?>
