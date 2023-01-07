// Constants
const path = require("path");
const url = require("url");
const fs = require("fs");
const db = require(path.join(__dirname, "../dbCore.js"));

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
            setTimeout(() => {

                this.window.hide();
                
                setTimeout(() => {
                    
                    const userInfoData = db.read(userInfodb);

                    if (userInfoData.token) {
                        WindowController.spawnWindow("MainWindowHandler");
                    } else {
                        WindowController.spawnWindow("LoginWindowHandler");
                    }
                    this.window.close();
                }, 1000);
            }, 10000);

        } else {
            this.window.focus();
        }
    }
}

module.exports = LoadingWindowHandler;