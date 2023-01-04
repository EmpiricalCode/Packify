// Elements
var emailField = document.getElementById("email-field");
var usernameField = document.getElementById("username-field");
var passwordField = document.getElementById("password-field");
var signupButton = document.getElementById("submit");
var loadingIcon = document.getElementById("loading-icon");

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

        signupButton.classList.add("submit-pressed");
        signupButton.style.pointerEvents = "none";
        
        loadingIcon.classList.add("visible");
        loadingIcon.classList.remove("hidden");

        window.system.signupFinished((data) => {

            signupButton.classList.remove("submit-pressed");
            signupButton.style.pointerEvents = "auto";

            loadingIcon.classList.add("hidden");
            loadingIcon.classList.remove("visible"); 

            canSignup = true;
        })
    }
}