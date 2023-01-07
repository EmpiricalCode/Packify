// Constants
const path = require("path");
const url = require("url");
const fs = require("fs");

const config = require(path.join(__dirname, "../config.js"));

const {app, BrowserWindow, dialog, protocol, ipcMain} = require("electron");

const WindowController = require(path.join(__dirname, "../windows/windowController.js"));
const WindowHandler = require(path.join(__dirname, "../structures/windowHandler.js"));

// Class
class MainWindowHandler extends WindowHandler {

    static channels = [
        "request-app-version"
    ]

    static spawn() {

        if (!this.window) {

            this.window = WindowHandler.spawnWindow(path.join(__dirname, "../../public/html/index.html"), {
                width: 800, 
                height: 600,
                frame: false,
                webPreferences : {
                    preload: path.join(__dirname, "../preloaders/mainPreload.js"),
                },
                show: false,
            })

            // Handle window closed
            this.window.on("closed", () => {
                this.window = undefined;
            })

            // handle window open
            this.window.once("ready-to-show", () => {
                this.window.show();
            })

            // Communication
            ipcMain.handle("request-app-version", async (event, args) => {
                return new Promise((resolve, reject) => {
                    resolve(config.version);
                })
            })

        } else {
            this.window.focus();
        }
    }
}

module.exports = MainWindowHandler;