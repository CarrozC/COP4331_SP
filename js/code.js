const urlBase = 'http://group30.xyz/LAMPAPI/';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";


document.addEventListener("DOMContentLoaded", function() {
    //Attach signup
    const signUpButton = document.getElementById("signUpConfirm");
    if (signUpButton) {
        signUpButton.addEventListener("click", handleSignup);
    }

    //sttach login
    const loginButton = document.getElementById("loginConfirm");
    if (loginButton) {
        loginButton.addEventListener("click", handleLogin);
    }
});



// Wait for the DOM to fully load before attaching event listeners
document.addEventListener("DOMContentLoaded", function() {
    // Attach signup event listener
    const signUpButton = document.getElementById("signUpConfirm");
    
    if (signUpButton) {
        // Ensure the event listener is attached correctly
        signUpButton.addEventListener("click", handleSignup);
    }
});

// signup function to handle the signup process
function handleSignup() {
    console.log("Button clicked"); // Debugging to check if the event listener works

    // Fetch input values
    let firstName = document.getElementById("signupFirstName").value;
    let lastName = document.getElementById("signupLastName").value;
    let login = document.getElementById("signupLogin").value;
    let password = document.getElementById("signupPassword").value;
    let passwordConfirm = document.getElementById("signupPasswordConfirm").value;

    // Clear previous feedback messages
    document.getElementById("firstNameResult").innerHTML = "";
    document.getElementById("lastNameResult").innerHTML = "";
    document.getElementById("usernameResult").innerHTML = "";
    document.getElementById("passwordResult").innerHTML = "";
    document.getElementById("confirmPasswordResult").innerHTML = "";

    let hasErrors = false;

    // Validation for non-empty values
    if (firstName === "") {
        document.getElementById("firstNameResult").innerHTML = "First Name is required.";
        document.getElementById("firstNameResult").style.color = "red";
        hasErrors = true; 
    }

    if (lastName === "") {
        document.getElementById("lastNameResult").innerHTML = "Last Name is required.";
        document.getElementById("lastNameResult").style.color = "red";
        hasErrors = true; 
    }

    if (login === "") {
        document.getElementById("usernameResult").innerHTML = "Username is required.";
        document.getElementById("usernameResult").style.color = "red";
        hasErrors = true;
    }

    // Password length validation (minimum of 8 characters)
    if (password.length < 8) {
        document.getElementById("passwordResult").innerHTML = "Password must be at least 8 characters.";
        document.getElementById("passwordResult").style.color = "red";
        hasErrors = true;
    }

    // Check if passwords match
    if (password !== passwordConfirm) {
        document.getElementById("confirmPasswordResult").innerHTML = "Passwords do not match.";
        document.getElementById("confirmPasswordResult").style.color = "red";
        hasErrors = true;
    }

    // Stop form submission if there are validation errors
    if (hasErrors) {
        return; // Exit the function early if validation fails
    }

    // Prepare the data to send to the API
    let tmp = { FirstName: firstName, LastName: lastName, Login: login, Password: password };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SignUp.' + extension;
    console.log("API Request URL:", url); // Debugging to check the API URL

    // Create and configure the XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // Handle the response from the server
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Response received"); // Debugging to check if the response comes back
		console.log(xhr.responseText);  // Log the raw response text to debug
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error) {
                    document.getElementById("signupResult").innerHTML = "Signup failed: " + jsonObject.error;
                    document.getElementById("signupResult").style.color = "red";
                    return;
                }
                // Show success confirmation message
                document.getElementById("signupResult").innerHTML = "Account successfully created!";
                document.getElementById("signupResult").style.color = "green";

                // Redirect to login page after 1 second delay
                setTimeout(function() {
                    window.location.href = "login.html";
                }, 1000); // 1 second delay before redirection
            } else if (xhr.readyState === 4) {
                // Handle non-200 status errors
                document.getElementById("signupResult").innerHTML = "Error occurred: " + xhr.status;
                document.getElementById("signupResult").style.color = "red";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("signupResult").innerHTML = err.message;
        document.getElementById("signupResult").style.color = "red";
    }
}


// Function to handle login
function handleLogin() {
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    document.getElementById("loginResult").innerHTML = "";  // Clear any previous result

    let tmp = { login: login, password: password };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;
    console.log("API Request URL:", url);  // Log the URL to check

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                let userId = jsonObject.id;

                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    document.getElementById("loginResult").style.color = "red";
                    return;
                }

                // Store user info in cookies or session
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
                saveCookie();

                // Redirect to another page (e.g., dashboard)
                window.location.href = "contacts.html";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
        document.getElementById("loginResult").style.color = "red";
    }
}


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}
