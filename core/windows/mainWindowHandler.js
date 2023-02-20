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
                minWidth: 600,
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

            ipcMain.handle("request-user-data", async (event, args) => {
                const data = await new Promise((resolve, reject) => {

                    const formattedData = {token : db.read(userInfodb).token};
                    
                    API.request(config.api_gateway_url, "/requestuserdata", formattedData, (success, res) => {

                        if (success) {
                            resolve(res);
                        } else {   
                            console.log(res.error);
                            // TODO: Handle error
                        }
                    });
                })

                return data.userData;
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