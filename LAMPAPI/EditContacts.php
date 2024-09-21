<?php
$inData = getRequestInfo();
$newName = $inData["Name"];
$newPhone = $inData["Phone"];
$newEmail = $inData["Email"];
$newID = $inData["ID"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("UPDATE Contacts SET Name = ?, Phone = ?, Email = ? WHERE ID = ?");
    $stmt->bind_param("sssi", $newName, $newPhone, $newEmail, $newID);
    
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
