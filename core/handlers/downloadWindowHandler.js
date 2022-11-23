// Constants
const path = require("path");
const url = require("url");
const fs = require("fs");
const https = require("https");

const {app, BrowserWindow, dialog, protocol, ipcMain} = require("electron");

const WindowHandler = require(path.join(__dirname, "../util/windowHandler.js"));

// Let statments
let window;

// Variables
var downloads = [];

// Class
class DownloadWindowHandler extends WindowHandler {

    static spawn(args) {

        // Setting up the download window
        if (!this.window) {

            this.window = WindowHandler.spawnWindow(path.join(__dirname, "../../public/html/download.html"), {
                width: 800, 
                height: 600,
                webPreferences : {
                    preload: path.join(__dirname, "../preloaders/downloadPreload.js")
                },
            });

            this.window.on("closed", () => {
                this.window = undefined;
            })

            this.window.once("ready-to-show", () => {
                this.window.webContents.toggleDevTools();
                this.spawnDownloadProcess(args);
            })

        } else {
            this.window.focus();
            this.spawnDownloadProcess(args);
        }
    }

    static async spawnDownloadProcess(args) {

        // "this" keyword doesn't reference the class when within a promise
        // so we have to define it outside
        var window = this.window;

        // If there are no current downloads, initialize the download process
        if (downloads.length == 0) {

            downloads.push(args)

            while (downloads.length > 0) {

                let url, filename;
                
                // Getting the URL and filename from the arguments
                [url, filename] = downloads[0];

                // Downloading the file
                await new Promise(resolve => {
                
                    const file = fs.createWriteStream(filename);
                    
                    https.get(url, function(response) {

                        // Processing chunk
                        response.on("data", (chunk) => {
                            file.write(chunk);
                        })
            
                        // Download complete
                        response.on("end", () => {     
                            window.webContents.send("download-args", "download complete.");
                            
                            file.close();
                            resolve();
                        });

                    }).on("error", () =>{
                        dialog.showErrorBox("Error", "Failed to open download url.");
                    });
                })

                downloads = downloads.slice(1);
            }

            window.webContents.send("download-args", "done");
        
        // If there is already a download process, just queue the download
        } else {
            downloads.push(args);
        }
    }
}

module.exports = DownloadWindowHandler;