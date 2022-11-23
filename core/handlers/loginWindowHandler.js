// Constants
const path = require("path");
const url = require("url");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../../package.json"), "utf-8"));

const {app, BrowserWindow, dialog, protocol, ipcMain} = require("electron");

const MainWindowHandler = require(path.join(__dirname, "../handlers/mainWindowHandler.js"));
const WindowHandler = require(path.join(__dirname, "../util/windowHandler.js"));

// Functions
class LoginWindowHandler extends WindowHandler {

    static spawn() {

        if (!this.window) {

            // Spawn window
            this.window = WindowHandler.spawnWindow(path.join(__dirname, "../../public/html/login.html"), {
                width: 310, 
                height: 490,
                frame: false,
                webPreferences : {
                    preload: path.join(__dirname, "../preloaders/loginPreload.js"),
                },
                show: false,
            });

            this.window.setResizable(false);

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

module.exports = LoginWindowHandler;