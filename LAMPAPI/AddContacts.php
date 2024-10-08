<?php
$inData = getRequestInfo();
$Name = $inData["Name"];
$phone = $inData["phone"];
$email = $inData["email"];
$userId = $inData["userId"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("INSERT INTO Contacts (Name, Phone, Email, UserID) VALUES(?, ?, ?, ?)");
    $stmt->bind_param("sssi", $Name, $phone, $email, $userId);
    $stmt->execute();
    $stmt->close();
    $conn->close();
    returnWithInfo("Contact added successfully");
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
