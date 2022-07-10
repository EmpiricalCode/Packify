// Constants
const path = require("path");
const url = require("url");

const {app, BrowserWindow, dialog, protocol, ipcMain} = require("electron");

// Let statments
let window;

// Functions
function spawn() {

    if (!window) {

        window = new BrowserWindow({
            width: 800, 
            height: 600,
            webPreferences : {
                nodeIntegration: true,
                contextIsolation: false
            },
        });

        window.loadURL(url.format({
            pathname: path.join(__dirname, "../../public/html/index.html"),
            protocol: 'file:',
            slashes: true
        }))
        
        window.on("closed", () => {
            mainWindow = undefined;
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