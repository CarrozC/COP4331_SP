<?php
$inData = getRequestInfo();
$newName = $inData["Name"];
<<<<<<< HEAD
$newPhone = $inData["phone"];
$newEmail = $inData["email"];
$ID = $inData["ID"];
=======
$newPhone = $inData["Phone"];
$newEmail = $inData["Email"];
$newID = $inData["ID"];
$userID = $inData["UserId"]
>>>>>>> ccc161ab319d350e653b0ce7a343d86530ba2606

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) {-
    returnWithError($conn->connect_error);
} else {
<<<<<<< HEAD
    $stmt = $conn->prepare("UPDATE Contacts SET Name = ?, Phone = ?, Email = ? WHERE ID = ?");
    $stmt->bind_param("sssi", $newName, $newPhone, $newEmail, $ID);
=======
    $stmt = $conn->prepare("UPDATE Contacts SET Name = ?, Phone = ?, Email = ? WHERE ID = ? AND UserID = ? ");
    $stmt->bind_param("sssii", $newName, $newPhone, $newEmail, $newID, $userID);
>>>>>>> ccc161ab319d350e653b0ce7a343d86530ba2606
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
