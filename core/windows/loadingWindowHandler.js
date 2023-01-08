// Constants
const path = require("path");
const url = require("url");
const fs = require("fs");
const db = require(path.join(__dirname, "../dbCore.js"));

const API = require(path.join(__dirname, "../APICore.js"));
const config = require(path.join(__dirname, "../config.js"));

const {app, BrowserWindow, dialog, protocol, ipcMain} = require("electron");

const WindowController = require(path.join(__dirname, "../windows/windowController.js"));
const WindowHandler = require(path.join(__dirname, "../structures/windowHandler.js"));

const userInfodb = db.create(`${config.app_data_path}/db`, "userInfo");

// Let statments
let window;

// Functions
class LoadingWindowHandler extends WindowHandler {
    
    static channels = [];

    static spawn() {

        if (!this.window) {

            // Spawning window
            this.path = path.join(__dirname, "../../public/html/loading.html");

            this.options = {
                width: 320, 
                height: 240,
                frame: false,
                webPreferences : {
                    preload: path.join(__dirname, "../preloaders/loadingPreload.js"),
                },
                show: false,
            }

            super.spawn(this.path, this.options);

            this.window.setResizable(false);

            // Process loading
            this.window.once("ready-to-show", () => {

                setTimeout(() => {
                    
                    setTimeout(() => {

                        const userInfoData = db.read(userInfodb);

                        this.window.hide();
                        
                        API.request(config.api_gateway_url, "/authenticate", {"token" : userInfoData.token}, (success, res) => {

                            if (res.verified) {
                                WindowController.spawnWindow("MainWindowHandler");
                            } else {
                                db.remove(userInfodb, "token");
                                WindowController.spawnWindow("LoginWindowHandler");
                            }

                            this.window.close();
                        });

                    }, 1000);
                }, 5000);
            });

        } else {
            this.window.focus();
        }
    }
}

module.exports = LoadingWindowHandler;