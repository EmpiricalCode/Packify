// Elements
var emailField = document.getElementById("email-field");
var usernameField = document.getElementById("username-field");
var passwordField = document.getElementById("password-field");
var signupButton = document.getElementById("submit");

// Variables
var canSignup = true;

// Functions
function login() {
    window.system.promptLogin();
}

function signup() {
    if (canSignup) {
        canSignup = false;

        const data = {"email" : emailField.value, "username" : usernameField.value, "password" : passwordField.value};

        window.system.signup(data);

        signupButton.style.border = "2px solid rgb(148, 189, 148)";
        signupButton.style.background = "rgb(148, 189, 148)";
        signupButton.style.cursor = "auto";

        window.system.signupFinished((data) => {
            signupButton.style.border = "2px solid rgb(88, 143, 88)";
            signupButton.style.background = "rgb(88, 143, 88)";
            signupButton.style.cursor = "pointer";

            canSignup = true;
        })
    }
}