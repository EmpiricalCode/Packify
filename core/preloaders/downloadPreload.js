// Constants
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("system", {
    
    requestAppVersion: () => ipcRenderer.invoke("request-app-version"),

    onDownloadArgs: (callback) => {
        ipcRenderer.on("download-args", (event, args) => {
            callback(event, args);
        });
    }
})