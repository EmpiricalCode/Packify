// Constants
const path = require("path");
const url = require("url");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../../package.json"), "utf-8"));

const {app, BrowserWindow, dialog, protocol, ipcMain} = require("electron");

const WindowController = require(path.join(__dirname, "../controllers/windowController.js"));
const WindowHandler = require(path.join(__dirname, "../structures/windowHandler.js"));

// Class
class MainWindowHandler extends WindowHandler {

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