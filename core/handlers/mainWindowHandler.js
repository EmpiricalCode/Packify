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

        window = windowHandler.spawnWindow(path.join(__dirname, "../../public/html/index.html"), {
            width: 800, 
            height: 600,
            webPreferences : {
                nodeIntegration: true,
                contextIsolation: false
            },
        });

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