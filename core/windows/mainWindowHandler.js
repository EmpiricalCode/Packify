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

            // Spawning window
            this.path = path.join(__dirname, "../../public/html/index.html");
            
            this.options = {
                width: 900, 
                height: 700,
                minWidth: 400,
                minHeight: 400,
                frame: false,
                webPreferences : {
                    preload: path.join(__dirname, "../preloaders/mainPreload.js"),
                },
                show: false,
            };

            super.spawn(this.path, this.options);

            // Initialization
            this.window.once("ready-to-show", () => {
                this.window.webContents.toggleDevTools();
            })

            this.window.on("maximize", () => {
                this.window.webContents.send("resize", {});
            })

            this.window.on("unmaximize", () => {
                this.window.webContents.send("resize", {});
            })
            
            // Communication
            ipcMain.handle("request-app-version", async (event, args) => {
                return new Promise((resolve, reject) => {
                    resolve(config.version);
                })
            })

            ipcMain.on("close",  (event, args) => {
                this.window.close();
            })

            ipcMain.on("resize",  (event, maximize) => {
                if (maximize) {
                    this.window.maximize();
                } else {
                    this.window.unmaximize();
                }
            })
            
            ipcMain.on("minimize",  (event, args) => {
                this.window.minimize();
            })

        } else {
            this.window.focus();
        }
    }
}

module.exports = MainWindowHandler;