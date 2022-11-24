// Elements
var emailField = document.getElementById("email-field");
var usernameField = document.getElementById("username-field");
var passwordField = document.getElementById("password-field");

// Functions
function login() {
    window.system.promptLogin();
}

function signup() {
    const data = {"email" : emailField.value, "username" : usernameField.value, "password" : passwordField.value};

    window.system.signup(data);
}