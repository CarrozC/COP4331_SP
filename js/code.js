const urlBase = 'http://group30.xyz/LAMPAPI/';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";


// Signup and Login
document.addEventListener("DOMContentLoaded", function() {
    // Event listener for the signup button (already implemented)
    document.getElementById("signUpConfirm").addEventListener("click", function() {
        let firstName = document.getElementById("signupFirstName").value;
        let lastName = document.getElementById("signupLastName").value;
        let login = document.getElementById("signupLogin").value;
        let password = document.getElementById("signupPassword").value;
        let passwordConfirm = document.getElementById("signupPasswordConfirm").value;

        // Check if passwords match
        if (password !== passwordConfirm) {
            document.getElementById("signupResult").innerHTML = "Passwords do not match.";
            document.getElementById("signupResult").style.color = "red";
            return;
        }

        let tmp = { FirstName: firstName, LastName: lastName, Login: login, Password: password };
        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/SignUp.' + extension;
        console.log("API Request URL:", url);  // Log the URL to check

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let jsonObject = JSON.parse(xhr.responseText);

                    if (jsonObject.error) {
                        document.getElementById("signupResult").innerHTML = "Signup failed: " + jsonObject.error;
                        document.getElementById("signupResult").style.color = "red";
                        return;
                    }

                    // If successful, redirect to index or give feedback
                    window.location.href = "index.html";
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            document.getElementById("signupResult").innerHTML = err.message;
            document.getElementById("signupResult").style.color = "red";
        }
    });

    // Event listener for the login button
    document.getElementById("loginConfirm").addEventListener("click", function() {
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
                    window.location.href = "dashboard.html";
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            document.getElementById("loginResult").innerHTML = err.message;
            document.getElementById("loginResult").style.color = "red";
        }
    });
});




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
