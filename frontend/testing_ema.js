// call backend API
fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            surname: surname,
            email: email,
            password: password,
            role: role
        })
    })
    .then(response => {
        if(response.ok) {
            alert("Registration succesful!");
            // navigate to another page
            window.location.href = "home.html";
            return response.json();
        }
        else {
            throw new Error("Registration failed. Please try again.");
        }
    })
    .then(data => {
        console.log("Registration data:", data);
    })
    .catch(error => {
        console.error("Error during registration:", error);
        alert("An error occurred. Please try again later.");
    })