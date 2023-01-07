// Constants
const path = require("path");
const url = require("url");
const fs = require("fs");

const config = require(path.join(__dirname, "../config.js"));

const {app, BrowserWindow, dialog, protocol, ipcMain, ipcRenderer} = require("electron");

const WindowController = require(path.join(__dirname, "../windows/windowController.js"));
const WindowHandler = require(path.join(__dirname, "../structures/windowHandler.js"));

// Functions
class LoginWindowHandler extends WindowHandler {

    static spawn() {

        if (!this.window) {

            // Spawn window
            this.window = WindowHandler.spawnWindow(path.join(__dirname, "../../public/html/login.html"), {
                width: 310, 
                height: 440,
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
            this.window.once("closed", () => {
                this.window = undefined;
            })

            // Handle Communication
            // Preventing spamming the signup-prompt button
            setTimeout(() => {
                ipcMain.once("prompt-signup", () => {

                    WindowController.spawnWindow("SignupWindowHandler");
                    this.window.close();
                })
            }, 100);

            ipcMain.on("login", (event, data) => {
                console.log(data.username + " " + data.password);

                setTimeout(() => {
                    this.window.webContents.send("login-finished", {});
                }, 3000);
            })

        } else {
            this.window.focus();
        }
    }
}

module.exports = LoginWindowHandler;