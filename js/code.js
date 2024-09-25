const urlBase = 'http://group30.xyz/LAMPAPI/';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const ids = []; 


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

	// attach add contact 
	const addContactButton = document.getElementById("addContactButton"); 
	if(addContactButton)
	{
		addContactButton.addEventListener("click", addContact); 
	}

    // attach search functionality 
    document.getElementById("search").addEventListener("input", function(){
        loadContacts(); // reload contact chart
    }); 

    // When the user clicks add contact, open the menu 
    addButton.onclick = function() {
        document.getElementById("contactTitle").innerText = "Add Contact"; 
        modal.style.display = "block"; 
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
                userId = jsonObject.id;

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
		document.getElementById("user").innerHTML = firstName + " " + lastName;
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

// contact modal 
let modal = document.getElementById("contactModal"); 

// add contact button 
let addButton = document.getElementById("add"); 

// get the close button 
let close = document.getElementsByClassName("close")[0]; 



close.onclick = function() {
    // reset fields 
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('phone').value = "";
    modal.style.display = "none"; 
}


// function to handle adding contacts
function addContact()
{
	let newName = document.getElementById("name").value; 
	let newEmail = document.getElementById("email").value; 
	let newPhoneNumber = document.getElementById("phone").value; 

	// reset error messages 
	document.getElementById("contactNameResult").innerHTML = ""; 
	document.getElementById("contactEmailResult").innerHTML = ""; 
	document.getElementById("contactPhoneResult").innerHTML = ""; 
	// reset result text
	document.getElementById("addContactResult").innerHTML = "";

	// check if input is valid
	if(!validateContactInputs(newName, newEmail, newPhoneNumber))
	{
		return; 
	}


	let tmp = {
		Name: newName,  
		phone: newPhoneNumber, 
		email: newEmail, 
		userId: userId 
	}; 
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("addContactResult").innerHTML = "Contact has been added";
                document.getElementById("addContactResult").style.color = "green";
				loadContacts();  
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
		document.getElementById("contactAddResult").style.color = "red";
	}
	
}

function deleteContact(button)
{
    // give the user an alert box asking for deletion confirmation
    let userResponse = confirm("Are you sure you want to delete this contact?"); 

    if(!userResponse)
    {
        return; 
    }
	// get the row of the button that was clicked
	let row = button.parentNode.parentNode; 
	// get the name of the contact 
	let rowName = row.cells[0].innerHTML; 

	let tmp = {
		firstName: rowName,
		userId: userId
	}

	let jsonPayload = JSON.stringify(tmp); 
	let url = urlBase + '/DeleteContact.' + extension; 

	let xhr = new XMLHttpRequest(); 
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("addContactResult").innerHTML = "Deletion Successful";
				document.getElementById("addContactResult").style.color = "green";
				loadContacts(); 
	
			}
		};
		xhr.send(jsonPayload);
        
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
		document.getElementById("contactAddResult").style.color = "red";
	}

}

 function editContact(button) {
    // open the edit contact menu 
    modal.style.display = "block"; 
    // Get the row of the contact to edit
    let row = button.parentNode.parentNode;

    // Get current contact details
    let currentName = row.cells[0].innerHTML;
    let currentEmail = row.cells[1].innerHTML;
    let currentPhone = row.cells[2].innerHTML;

    // Pre-fill the form with current contact details
    document.getElementById("name").value = currentName;
    document.getElementById("email").value = currentEmail;
    document.getElementById("phone").value = currentPhone;

    // Change the "Add Contact" button to an "Update Contact" button
    let addContactButton = document.getElementById("addContactButton");
    addContactButton.innerText = "Update Contact";

    // Remove any existing click event for adding contact
    addContactButton.removeEventListener("click", addContact);

    // Attach the "updateContact" function for the update process
    let updateHandler = function () {
        updateContact(row);
    };

    // Attach the update event handler and store it so we can remove it later
    addContactButton.addEventListener("click", updateHandler);
    addContactButton.updateHandler = updateHandler;
}

function updateContact(row) {
    // Get the contact ID (assuming ids[] stores the IDs of each contact row)
    let contactId = ids[row.rowIndex - 1]; // The rowIndex starts at 1, adjust for zero-based array
	console.log(contactId); 

    // Get updated details from the form
    let updatedName = document.getElementById("name").value;
    let updatedEmail = document.getElementById("email").value;
    let updatedPhone = document.getElementById("phone").value;

    // Validate inputs before sending the update
    if (!validateContactInputs(updatedName, updatedEmail, updatedPhone)) {
        return;
    }

    // Prepare payload
    let tmp = {
        userId: userId,
        ID: contactId,
        Name: updatedName,
        email: updatedEmail,
        phone: updatedPhone
    };
    let jsonPayload = JSON.stringify(tmp);

    // Send the updated data to the server
    let url = urlBase + '/EditContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("addContactResult").innerText = "Contact updated successfully!";
                document.getElementById("addContactResult").style.color = "green";

                // Refresh the contact list
                loadContacts();

                // Reset button back to "Add Contact"
                let addContactButton = document.getElementById("addContactButton");
                addContactButton.innerText = "Add Contact";

                // Reset input fields
                document.getElementById('name').value = "";
                document.getElementById('email').value = "";
                document.getElementById('phone').value = "";

                // Remove the specific update handler and re-attach the add contact event
                addContactButton.removeEventListener("click", addContactButton.updateHandler);
                addContactButton.addEventListener("click", addContact);
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("addContactResult").innerText = err.message;
        document.getElementById("addContactResult").style.color = "red";
    }
}

function validateContactInputs(name, email, phone) {
    let hasErrors = false;

    // Reset previous validation messages
    document.getElementById("contactNameResult").innerHTML = "";
    document.getElementById("contactEmailResult").innerHTML = "";
    document.getElementById("contactPhoneResult").innerHTML = "";

    // Validate Name
    if (name.trim() === "") {
        document.getElementById("contactNameResult").innerHTML = "Name must be entered.";
        document.getElementById("contactNameResult").style.color = "red";
        hasErrors = true;
    }

    // Validate Email
    if (email.trim() === "") {
        document.getElementById("contactEmailResult").innerHTML = "Email must be entered.";
        document.getElementById("contactEmailResult").style.color = "red";
        hasErrors = true;
    } else if (!validateEmail(email)) {
        document.getElementById("contactEmailResult").innerHTML = "Invalid Email.";
        document.getElementById("contactEmailResult").style.color = "red";
        hasErrors = true;
    }

    // Validate Phone
    if (phone.trim() === "") {
        document.getElementById("contactPhoneResult").innerHTML = "Phone Number must be entered.";
        document.getElementById("contactPhoneResult").style.color = "red";
        hasErrors = true;
    } else if (!validatePhoneNumber(phone)) {
        document.getElementById("contactPhoneResult").innerHTML = "Invalid Phone Number.";
        document.getElementById("contactPhoneResult").style.color = "red";
        hasErrors = true;
    }

    return !hasErrors; // Returns true if no errors
}

// helper functions 
function validateEmail(email)
{
	const ret = String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/); 
	return Boolean(ret); 
}

function validatePhoneNumber(phone)
{
	let regex = /^\+?(\d{1,3})?[-. (]?(\d{3})[-. )]?(\d{3})[-. ]?(\d{4})$/; 
	const ret = String(phone).toLowerCase().match(regex); 
	return Boolean(ret); 
}

// load contacts for the table
function loadContacts()
{
    readCookie(); // gets info of logged in user
	var tableBody = document.getElementById("contactTable").getElementsByTagName('tbody')[0]; // table reference
    // get any searches entered
    let searchString = document.getElementById("search").value; 
	// create a search
	let tmp = {
		search: searchString,
		UserID: userId
	}; 

	let jsonPayload = JSON.stringify(tmp); 

	let url = urlBase + '/SearchContact.' + extension; 
	let xhr = new XMLHttpRequest(); 
	xhr.open("POST", url, true); 
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8"); 

	try
	{
		xhr.onreadystatechange = function()
		{
			if(this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText); 
				console.log(jsonObject); 
				if(jsonObject.error)
				{
					console.log(jsonObject.error); 
					// clear the table
					tableBody.innerHTML = "";

					return; 
				}
				 // Clear the table body before adding new rows
				 tableBody.innerHTML = ""; // This clears the tbody
				for(let i = 0; i < jsonObject.results.length; i++)
				{
					ids[i] = jsonObject.results[i].ID;
            		var newRow = tableBody.insertRow(tableBody.rows.length);

					// Insert new cells in the new row
					var cell1 = newRow.insertCell(0);
					var cell2 = newRow.insertCell(1);
					var cell3 = newRow.insertCell(2);
					var cell4 = newRow.insertCell(3);

					// Add text to the new cells
					cell1.innerHTML = jsonObject.results[i].Name;
					cell2.innerHTML = jsonObject.results[i].Email;
					cell3.innerHTML = jsonObject.results[i].Phone; 

					// Add edit and delete buttons
					cell4.innerHTML = `
						<button class="buttons" onclick="editContact(this)">Edit</button>
						<button class="buttons" onclick="deleteContact(this)">Delete</button>
					`;

					// Clear input fields after adding the contact
					document.getElementById('name').value = "";
					document.getElementById('email').value = "";
					document.getElementById('phone').value = ""; 

				}
			}
		}; 
		xhr.send(jsonPayload); 
	}
	catch(err)
	{
		console.log(err.message); 
	}
	
}
