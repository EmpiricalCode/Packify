// Constants
const path = require("path");
const url = require("url");
const fs = require("fs");
const db = require(path.join(__dirname, "../dbCore.js"));

const API = require(path.join(__dirname, "../APICore.js"));
const config = require(path.join(__dirname, "../config.js"));

const {app, BrowserWindow, dialog, protocol, ipcMain, ipcRenderer} = require("electron");

const WindowController = require(path.join(__dirname, "../windows/windowController.js"));
const WindowHandler = require(path.join(__dirname, "../structures/windowHandler.js"));

const userInfodb = db.create(`${config.app_data_path}/db`, "userInfo");

// Functions
class LoginWindowHandler extends WindowHandler {

    static channels = [
        "login"
    ];
    
    static spawn() {

        if (!this.window) {

            // Spawning window
            this.path = path.join(__dirname, "../../public/html/login.html");

            this.options = {
                width: 310, 
                height: 440,
                frame: false,
                webPreferences : {
                    preload: path.join(__dirname, "../preloaders/loginPreload.js"),
                },
                show: false,
            }

            super.spawn(this.path, this.options);

            this.window.setResizable(false);

            // Handle Communication
            // Preventing spamming the signup-prompt button
            setTimeout(() => {
                ipcMain.once("prompt-signup", () => {

                    WindowController.spawnWindow("SignupWindowHandler");
                    this.window.close();
                })
            }, 100);

            ipcMain.on("login", (event, data) => {
                
                const formatted_data = {"username" : data.username, "password" : data.password};

                API.request(config.api_gateway_url, "/login", formatted_data, (success, res) => {

                    if (success) {
                        console.log(res.token);

                        db.set(userInfodb, "token", res.token);

                        this.window.hide();

                        setTimeout(() => {
                            WindowController.spawnWindow("MainWindowHandler");    
                            this.window.close();
                        }, 1000);
                    } else {
                        console.log(res.error);
                    }

                    this.window.webContents.send("login-finished", {});
                });
            })

        } else {
            this.window.focus();
        }
    }
}

module.exports = LoginWindowHandler;