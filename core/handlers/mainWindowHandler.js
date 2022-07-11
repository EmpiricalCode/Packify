// Constants
const path = require("path");
const url = require("url");

const {app, BrowserWindow, dialog, protocol, ipcMain} = require("electron");

const windowHandler = require(path.join(__dirname, "../util/windowHandler.js"));

// Let statments
let window;

// Functions
function spawn() {

    if (!window) {

        window = windowHandler.spawnWindow(800, 600);

        window.on("closed", () => {
            window = undefined;
        })

    } else {
        window.focus();
    }
}

function getWindow() {
    return window;
}

module.exports.getWindow = getWindow;
module.exports.spawn = spawn;