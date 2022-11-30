// Constants
const path = require("path");
const url = require("url");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../../package.json"), "utf-8"));

const {app, BrowserWindow, dialog, protocol, ipcMain} = require("electron");

// Let statments
let window;

// Functions
class WindowController {

    // Use this spawn function inside windowHandler classes to avoid circular imports
    static spawnWindow(name, ...args) {
        require(path.join(__dirname, `../windows/${name}.js`)).spawn(...args);
    }

    static closeWindow(name) {
        var windowClass = require(path.join(__dirname, `../windows/${name}.js`));

        if (windowClass.window) {
            windowClass.window.close();
        }
    }
}

module.exports = WindowController;