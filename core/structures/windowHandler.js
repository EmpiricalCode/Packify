// Constants
const url = require("url");
const path = require("path");

const {app, BrowserWindow, dialog, protocol, ipcMain} = require("electron");

// Class
class WindowHandler {

    static window;
    static channels = [];
    static registered_windows = [];

    static getWindow() {
        return this.window;
    }

    static spawnWindow(resource_url, preferences) {

        const window = new BrowserWindow(preferences);

        window.loadURL(url.format({
            pathname: resource_url,
            protocol: 'file:',
            slashes: true
        }))

        return window;
    }

    static spawn(path, options) {

        this.window = this.spawnWindow(path, options);

        // Handle window open
        this.window.once("ready-to-show", () => {
            this.window.show();
        })

        // Handle window closed
        this.window.once("closed", () => {

            // Removing all communication listeners once the window is closed
            this.channels.forEach((channel) => {
                ipcMain.removeAllListeners(channel);
            });

            this.window = undefined;
        })
    }
}
module.exports = WindowHandler;