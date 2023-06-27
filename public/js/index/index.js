// Variables
var maximized = false;
var appResizeButton = document.getElementById("app-resize-button");
var filesContainer = document.getElementById("files-container");
var menuBarButtons = document.getElementsByClassName("menu-bar-button");
var tabs = document.getElementsByClassName("tab-container");
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

        // Selecting current menu bar button
        for (var button of menuBarButtons) {
            if (button.id.split("-")[0] == name) {
                button.querySelector(".menu-bar-button-notch").classList.add("menu-bar-button-notch-active");
                button.classList.add("menu-bar-button-active");
            } else {
                button.querySelector(".menu-bar-button-notch").classList.remove("menu-bar-button-notch-active");
                button.classList.remove("menu-bar-button-active");
            }
        }

        // Hiding tabs
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
            
            } else {
                // TODO: Handle errors
            }

        } else {

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