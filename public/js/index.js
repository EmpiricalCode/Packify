// Variables
var maximized = false;
var appResizeButton = document.getElementById("app-resize-button");

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