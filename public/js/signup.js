// Elements
var emailField = document.getElementById("email-field");
var usernameField = document.getElementById("username-field");
var passwordField = document.getElementById("password-field");
var signupButton = document.getElementById("submit");
var loadingIcon = document.getElementById("loading-icon");

// Variables
var processingSignup = false;

// Functions
function login() {
    if (!processingSignup) {
        window.system.promptLogin();
    }
}

function signup() {
    if (!processingSignup) {
        processingSignup = true;

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

            processingSignup = false;
        })
    }
}