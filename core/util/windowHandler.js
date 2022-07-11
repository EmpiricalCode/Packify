// Constants
const url = require("url");
const path = require("path");

const {app, BrowserWindow, dialog, protocol, ipcMain} = require("electron");

// Functions
function spawnWindow(w, h, resource_url) {

    const window = new BrowserWindow({
        width: w, 
        height: h,
        webPreferences : {
            nodeIntegration: true,
            contextIsolation: false
        },
    });

    window.loadURL(url.format({
        pathname: resource_url,
        protocol: 'file:',
        slashes: true
    }))

    return window;
}

module.exports.spawnWindow = spawnWindow;