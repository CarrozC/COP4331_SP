<?php
$inData = getRequestInfo();
$FirstName = $inData["FirstName"];
$LastName = $inData["LastName"];
$newPhone = $inData["phone"];
$newEmail = $inData["email"];
$userId = $inData["userId"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) {-
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE UserID = ?");
    $stmt->bind_param("sssi", $FirstName, $LastName, $newPhone, $newEmail, $userId);
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
