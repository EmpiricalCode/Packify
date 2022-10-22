// Constants
const path = require("path");
const url = require("url");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../../package.json"), "utf-8"));

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
                preload: path.join(__dirname, "../preload.js")
            },
        });

        window.on("closed", () => {
            window = undefined;
        })

        // Communication
        ipcMain.handle("request-app-version", async (event, args) => {
            return new Promise((resolve, reject) => {
                resolve(config.version);
            })
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