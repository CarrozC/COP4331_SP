<?php

$inData = getRequestInfo();
$DateCreated = $inData["DateCreated"];
$DateLastLoggedIn = $inData["DateLastLoggedIn"];
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
    
    if($stmt->affected_rows > 0) 
    {
        returnWithInfo("Record added successfully");
    } 
    else 
    {
        returnWithError("Error adding record");
    }
    
    $stmt->close();
    $conn->close();
}
function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError( $err )
{
	$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
	sendResultInfoAsJson( $retValue );
}

function returnWithInfo( $firstName, $lastName, $id )
{
	$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
	sendResultInfoAsJson( $retValue );
}

?>
