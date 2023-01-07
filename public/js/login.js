// Variables
var usernameField = document.getElementById("username-field");
var passwordField = document.getElementById("password-field");

var loadingIcon = document.getElementById("loading-icon");
var loginButton = document.getElementById("submit");

var canLogin = true;

// Functions
function signup() {
    window.system.promptSignUp();
}

function login() {

    if (canLogin) {

        canLogin = false;

        window.system.login(usernameField.value, passwordField.value);

        loginButton.classList.add("submit-pressed");
        loginButton.style.pointerEvents = "none";

        loadingIcon.classList.add("visible");
        loadingIcon.classList.remove("hidden");

        window.system.loginFinished((data) => {

            canLogin = true;

            loginButton.classList.remove("submit-pressed");
            loginButton.style.pointerEvents = "auto";

            loadingIcon.classList.remove("visible");
            loadingIcon.classList.add("hidden");
        })
    }
}