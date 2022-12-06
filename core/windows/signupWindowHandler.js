// Constants
const path = require("path");
const url = require("url");
const fs = require("fs");
const db = require(path.join(__dirname, "../DBCore.js"));

const API = require(path.join(__dirname, "../APICore.js"));
const config = require(path.join(__dirname, "../config.js"));

const {app, BrowserWindow, dialog, protocol, ipcMain} = require("electron");

const WindowController = require(path.join(__dirname, "../windows/windowController.js"));
const WindowHandler = require(path.join(__dirname, "../structures/windowHandler.js"));

const hashString = require("../util/hashString.js");

const userInfoDB = db.create(`${config.app_data_path}/DB`, "User Info");

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
                    this.window.close();
                })
            }, 100);

            ipcMain.on("signup", (event, data) => {
                
                const [salt, hash] = hashString(data.password);
                const formatted_data = {"username" : data.username, "email" : data.email, "password" : hash, "salt" : salt};

                // Handing POST request to api
                API.request(config.api_gateway_url, "/signup", formatted_data, (success, res) => {

                    if (success) {
                        console.log(res.token);

                        db.set(userInfoDB, "token", res.token);
                    } else {
                        console.log(res.error);
                    }

                    this.window.webContents.send("signup-finished", res);
                })
            });

        } else {
            this.window.focus();
        }
    }
}

module.exports = SignupWindowHandler;