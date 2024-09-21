<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();
$newName = $inData["Name"];
$newPhone = $inData["Phone"];
$newEmail = $inData["Email"];
$ID = $inData["ID"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("UPDATE Contacts SET Name = ?, Phone = ?, Email = ? WHERE ID = ?");
    $stmt->bind_param("ssss", $newName, $newPhone, $newEmail, $ID);
    $stmt->execute();
    $stmt->close();
    $conn->close();
    returnWithInfo("Contact edited successfully");
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
