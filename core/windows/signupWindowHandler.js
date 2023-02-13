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

const userInfodb = db.create(`${config.app_data_path}/db`, "userInfo");

// Functions
class SignupWindowHandler extends WindowHandler {

    static channels = [
        "signup"
    ];

    static spawn() {

        if (!this.window) {

            // Spawning window
            this.path = path.join(__dirname, "../../public/html/signup.html");

            this.options = {
                width: 310, 
                height: 500,
                frame: false,
                webPreferences : {
                    preload: path.join(__dirname, "../preloaders/signupPreload.js"),
                },
                show: false,
            }

            super.spawn(this.path, this.options);

            this.window.setResizable(false);

            // Handle Communication
            // Preventing spamming the login-prompt button
            setTimeout(() => {
                ipcMain.once("prompt-login", () => {

                    WindowController.spawnWindow("loginWindowHandler");
                    this.window.close();
                })
            }, 100);

            ipcMain.on("signup", (event, data) => {
                
                const formattedData = {"username" : data.username, "email" : data.email, "password" : data.password};

                // Handing POST request to api
                API.request(config.api_gateway_url, "/signup", formattedData, (success, res) => {

                    if (success) {
                        console.log(res.token);

                        db.set(userInfodb, "token", res.token);

                        this.window.hide();

                        setTimeout(() => {
                            WindowController.spawnWindow("mainWindowHandler");    
                            this.window.close();
                        }, 1000);
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