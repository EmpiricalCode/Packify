// Variables
var maximized = false;
var appResizeButton = document.getElementById("app-resize-button");
var menuBarButtons = document.getElementsByClassName("menu-bar-button");
var tabs = document.getElementsByClassName("tab-container");
var dataUsedBar = document.getElementById("data-used-bar");
var bandwidthUsedBar = document.getElementById("bandwidth-used-bar");

let currTab;
var loaded = false;

let userData;
let userStatistics;

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

        if (name == "home") {
            setTimeout(() => {
                dataUsedBar.style.animation = "anim 2s cubic-bezier(0,.76,.63,1) forwards";
                bandwidthUsedBar.style.width = "30%";
            }, 200);
        } else {
            setTimeout(() => {
                dataUsedBar.style.animation = "";
                bandwidthUsedBar.style.width = "0%";
            }, 200);
        }

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

                tab.style.zIndex = 10;
                
                var t = tab;
                setTimeout(() => {
                    if (currTab == t.id.split("-")[0]) {
                        t.classList.add("tab-visible");
                    }
                }, 200);
            } else {
                tab.classList.remove("tab-visible");
                tab.style.zIndex = -1;
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

window.system.requestUserData().then((userDataRes) => {

    userData = userDataRes
    document.getElementById("dashboard-welcome-message").innerHTML += userData.username;

    setTimeout(() => {
        loaded = true;
        switchTabs("home");
    }, 700);
})