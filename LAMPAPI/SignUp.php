<?php


$inData = getRequestInfo();

$DateCreated = date("Y-m-d H:i:s");
$DateLastLoggedIn = date("Y-m-d H:i:s");
$FirstName = $inData["FirstName"];
$LastName = $inData["LastName"];
$Login = $inData["Login"];
$Password = $inData["Password"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error)
{
    returnWithError($conn->connect_error);
}
else
{
    $stmt = $conn->prepare("INSERT into Users (DateCreated, DateLastLoggedIn, FirstName, LastName, Login, Password) VALUES(?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $DateCreated, $DateLastLoggedIn, $FirstName, $LastName, $Login, $Password);
    $stmt->execute();
    $id = $conn->insert_id;
    $stmt->close();
    $conn->close();
    returnWithInfo($FirstName, $LastName, $id);
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo json_encode($obj);  // Corrected: Use json_encode() to output valid JSON
}

function returnWithInfo( $firstName, $lastName, $id )
{
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson( $retValue );
}

function returnWithError($err)
{
    $retValue = array("id" => 0, "firstName" => "", "lastName" => "", "error" => $err);
    sendResultInfoAsJson($retValue);
}
?>
