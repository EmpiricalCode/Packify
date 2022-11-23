// Constants
const path = require("path");
const url = require("url");

const {app, BrowserWindow, dialog, protocol, ipcMain} = require("electron");

const mainWindowHandler = require(path.join(__dirname, "core/handlers/mainWindowHandler.js"));
const downloadWindowHandler = require(path.join(__dirname, "core/handlers/downloadWindowHandler.js"));
const loadingWindowHandler = require(path.join(__dirname, "core/handlers/loadingWindowHandler.js"));
const config = require(path.join(__dirname, "core/config.js"));

// This needs to be done because there is a bug where
// when the app is launched from a deep link, the cwd will be System32 (and we don't have permissions there)
process.chdir(path.resolve(__dirname, "../"));

// Functions
function getDeepUrl(argv) {

    var deepurl = argv.slice(1);

    if (!deepurl) {
        return undefined;
    }

    deepurl = deepurl[argv.length - 2];

    if (deepurl && deepurl.indexOf(`${config.scheme}://`) == 0) {
        return deepurl;
    } else {
        return undefined;
    }
}

// App main  
// Prevent second instance
const lock = app.requestSingleInstanceLock();

if (!lock) {
    app.quit();
    return;
}

// Handle second instance
app.on("second-instance", (event, argv, cwd) => {

    const deepurl = getDeepUrl(argv);

    //Second instance prompted by deep link
    if (deepurl) {

        // Parsing arguments passed through URL
        const args = deepurl.slice(config.scheme.length + 3, deepurl.length).split(",,");

        // Spawning the download window
        if (args[0] == "download") {
            downloadWindowHandler.spawn(args.slice(1));
        }

    //Second instance prompted by regular opening of application
    } else {
        if (loadingWindowHandler.window) {
            loadingWindowHandler.spawn();
        } else {
            mainWindowHandler.spawn();
        }
    }
});

// Handle ready
app.on("ready", () => {

    const deepurl = getDeepUrl(process.argv);

    // App was started from a deep link
    if (deepurl) {

        // Parsing arguments passed through url
        const args = deepurl.slice(config.scheme.length + 3, deepurl.length).split(",,");

        // Spawning the download window
        if (args[0] == "download") {

            downloadWindowHandler.spawn(args.slice(1));

        } else {
            app.quit();
        }
    // App was opened regularly
    } else {
        if (mainWindowHandler.window) {
            
            mainWindowHandler.spawn();
        } else {
            loadingWindowHandler.spawn();
        }
    }
})

// Setting protocol
app.setAsDefaultProtocolClient(config.scheme);