// Constants
const path = require("path");
const url = require("url");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../../package.json"), "utf-8"));

const {app, BrowserWindow, dialog, protocol, ipcMain} = require("electron");

const WindowController = require(path.join(__dirname, "../controllers/windowController.js"));
const WindowHandler = require(path.join(__dirname, "../structures/windowHandler.js"));

// Functions
class SignupWindowHandler extends WindowHandler {

    static channels = [
        "signup"
    ];

    static spawn() {

        if (!this.window) {

            // Spawn window
            this.window = WindowHandler.spawnWindow(path.join(__dirname, "../../public/html/signup.html"), {
                width: 310, 
                height: 500,
                frame: false,
                webPreferences : {
                    preload: path.join(__dirname, "../preloaders/signupPreload.js"),
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

                // Removing all communication listeners once the window is closed
                this.channels.forEach((channel) => {
                    ipcMain.removeAllListeners(channel);
                });

                this.window = undefined;
            })

            // Handle Communication
            // Preventing spamming the login-prompt button
            setTimeout(() => {
                ipcMain.once("prompt-login", () => {

                    WindowController.spawnWindow("LoginWindowHandler");

                    setTimeout(() => {
                        this.window.close();
                    }, 200);
                })
            }, 220);

            ipcMain.on("signup", (event, data) => {
                console.log("data recieved");
                console.log(data);
            });

        } else {
            this.window.focus();
        }
    }
}

module.exports = SignupWindowHandler;