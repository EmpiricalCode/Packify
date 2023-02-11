// Variables
var maximized = false;
var appResizeButton = document.getElementById("app-resize-button");
var menuBarButtons = document.getElementsByClassName("menu-bar-button");

// Functions
function minimize() {
    window.system.minimize();
}

function resize() {
    window.system.resize(!maximized);
    maximized = !maximized;

    if (!maximized) {
        appResizeButton.style.backgroundImage = "url(../assets/images/maximize-icon.png)";
    } else {
        appResizeButton.style.backgroundImage = "url(../assets/images/windowed-icon.png)";
    }
}

function closeWindow() {
    window.system.close();
}

function switchWindows(name) {
    for (var button of menuBarButtons) {
        if (button.id.split("-")[0] == name) {
            button.querySelector(".menu-bar-button-notch").classList.add("menu-bar-button-notch-active");
            button.classList.add("menu-bar-button-active");
        } else {
            button.querySelector(".menu-bar-button-notch").classList.remove("menu-bar-button-notch-active");
            button.classList.remove("menu-bar-button-active");
        }
    }
}

setTimeout(() => {
    switchWindows("home");
}, 200);