// Variables
var maximized = false;
var appResizeButton = document.getElementById("app-resize-button");
var menuBarButtons = document.getElementsByClassName("menu-bar-button");
var tabs = document.getElementsByClassName("tab-container");
var dataUsedBar = document.getElementById("data-used-bar");
var bandwidthUsedBar = document.getElementById("bandwidth-used-bar");
var tabLoadingIcon = document.getElementById("tab-loading-icon");
var folderContainer = document.getElementById("folder-container");
var filesObjectContainer = document.getElementById("files-object-container");
var pathContainer = document.getElementById("path-container");

let currTab;
var loaded = true;

let userData;
let userStorageMetadata;
let userStatistics;

var currentLocation = [];


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

function hideSection(sectionName) {
    for (var element of document.getElementsByClassName(sectionName)) {
        element.style.display = "none";
    }
}

function showSection(sectionName) {
    for (var element of document.getElementsByClassName(sectionName)) {
        element.style.display = element.dataset.originaldisplay;
    }
}

async function switchTabs(name) {
    if (loaded && name != currTab) {
        tabLoadingIcon.classList.remove("hidden");
        loaded = false;
        currTab = name;

        var success = true;

        // Hiding current tab
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
            if (tab.id.split("-")[0] != name) {
                tab.classList.remove("tab-visible");
                tab.style.zIndex = -1;
            }
        }

        // Switching to home tab
        if (name == "home") {

            const ipcMainResponse = await window.system.requestUserData();

            success = ipcMainResponse.success;
            res = ipcMainResponse.res;
        
            if (success) {
                userData = res.userData;
                document.getElementById("dashboard-welcome-message").innerHTML = "Welcome back, " + userData.username;
            } else {
                // TODO: Handle errors
            }

            setTimeout(() => {
                dataUsedBar.style.animation = "anim 2s cubic-bezier(0,.76,.63,1) forwards";
                bandwidthUsedBar.style.width = "30%";
            }, 50);
        } else {
            setTimeout(() => {
                dataUsedBar.style.animation = "";
                bandwidthUsedBar.style.width = "0%";
            }, 200);
        }

        // Switching to files tab
        if (name == "files") {

            const ipcMainResponse = await window.system.requestStorageMetadata();

            success = ipcMainResponse.success;
            res = ipcMainResponse.res;
        
            if (success) {
                userStorageMetadata = res.metadata;

                console.log(userStorageMetadata);
                loadStorage();
            } else {
                // TODO: Handle errors
            }
        } 

        loaded = true;
        tabLoadingIcon.classList.add("hidden");

        // Showing new tab
        if (success) {
            for (var tab of tabs) {
                if (tab.id.split("-")[0] == name) {

                    tab.style.zIndex = 10;
                    tab.classList.add("tab-visible");
                }
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

switchTabs("home");