// Constants
const path = require("path");
const url = require("url");
const fs = require("fs");
const https = require("https");

const {app, BrowserWindow, dialog, protocol, ipcMain} = require("electron");

const windowHandler = require(path.join(__dirname, "../util/windowHandler.js"));

// Let statments
let window;

// Variables
var downloads = [];

// Functions
async function spawnDownloadProcess(args) {

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
                        window.webContents.send("downloadargs", "download complete.");
                        
                        file.close();
                        resolve();
                    });

                }).on("error", () =>{
                    dialog.showErrorBox("Error", "Failed to open download url.");
                });
            })

            downloads = downloads.slice(1);
        }

        window.webContents.send("downloadargs", "done");
    
    // If there is already a download process, just queue the download
    } else {
        downloads.push(args);
    }
}

function spawn(args) {

    // Setting up the download window
    if (!window) {

        window = windowHandler.spawnWindow(path.join(__dirname, "../../public/html/download.html"), {
            width: 800, 
            height: 600,
            webPreferences : {
                nodeIntegration: true,
                preload: path.join(__dirname, "../preloaders/mainPreload.js")
            },
        });

        window.on("closed", () => {
            window = undefined;
        })

        window.once("ready-to-show", () => {
            window.webContents.toggleDevTools();
            spawnDownloadProcess(args);
        })

    } else {
        window.focus();

        spawnDownloadProcess(args);
    }
}

function getWindow() {
    return window;
}

module.exports.getWindow = getWindow;
module.exports.spawn = spawn;