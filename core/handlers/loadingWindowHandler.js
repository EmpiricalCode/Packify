// Constants
const path = require("path");
const url = require("url");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../../package.json"), "utf-8"));

const {app, BrowserWindow, dialog, protocol, ipcMain} = require("electron");

const LoginWindowHandler = require(path.join(__dirname, "../handlers/loginWindowHandler.js"));
const WindowHandler = require(path.join(__dirname, "../util/windowHandler.js"));

// Let statments
let window;

// Functions
class LoadingWindowHandler extends WindowHandler {

    static spawn() {

        if (!this.window) {

            // Spawn window
            this.window = WindowHandler.spawnWindow(path.join(__dirname, "../../public/html/loading.html"), {
                width: 320, 
                height: 240,
                frame: false,
                webPreferences : {
                    preload: path.join(__dirname, "../preloaders/loadingPreload.js"),
                },
                show: false,
            });

            this.window.setResizable(false);

            // Process loading
            setTimeout(() => {

                this.window.hide();
                
                setTimeout(() => {
                    LoginWindowHandler.spawn();
                    this.window.close();
                }, 1000);
            }, 10000);

            // Handle window open
            this.window.once("ready-to-show", () => {
                setTimeout(() => {
                    this.window.show();
                }, 1000);
            })

            // Handle window closed
            this.window.on("closed", () => {
                this.window = undefined;
            })

        } else {
            this.window.focus();
        }
    }
}

module.exports = LoadingWindowHandler;