// Variables
var maximized = false;
var appResizeButton = document.getElementById("app-resize-button");
var menuBarButtons = document.getElementsByClassName("menu-bar-button");
var tabs = document.getElementsByClassName("tab-container");

let currTab;
var loaded = false;

// Functions
function minimize() {
    window.system.minimize();
}

function resize() {
    window.system.resize(!maximized);
}

function closeWindow() {
    window.system.close();
}

function switchTabs(name) {
    if (loaded) {
        currTab = name;

        for (var button of menuBarButtons) {
            if (button.id.split("-")[0] == name) {
                button.querySelector(".menu-bar-button-notch").classList.add("menu-bar-button-notch-active");
                button.classList.add("menu-bar-button-active");
            } else {
                button.querySelector(".menu-bar-button-notch").classList.remove("menu-bar-button-notch-active");
                button.classList.remove("menu-bar-button-active");
            }
        }

        for (var tab of tabs) {
            if (tab.id.split("-")[0] == name) {

                var t = tab;
                setTimeout(() => {
                    if (currTab == t.id.split("-")[0]) {
                        t.classList.add("tab-visible");
                    }
                }, 200);
            } else {
                tab.classList.remove("tab-visible");
            }
        }
    }
}

window.system.onResize(() => {
    maximized = !maximized;

    if (!maximized) {
        appResizeButton.style.backgroundImage = "url(../assets/images/maximize-icon.png)";
    } else {
        appResizeButton.style.backgroundImage = "url(../assets/images/windowed-icon.png)";
    }
})

window.system.requestUserData().then((res) => {

    document.getElementById("dashboard-welcome-message").innerHTML += res.username;

    setTimeout(() => {
        loaded = true;
        switchTabs("home");
    }, 200);
})