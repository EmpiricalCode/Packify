// Constants
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("system", {
    
    requestAppVersion: () => ipcRenderer.invoke("request-app-version"),

    requestUserData: () => {
        return ipcRenderer.invoke("request-user-data");
    },

    minimize: () => {
        ipcRenderer.send("minimize", {})
    },

    resize: (maximize) => {
        ipcRenderer.send("resize", maximize)
    },

    onResize: (callback) => {
        return ipcRenderer.on("resize", () => {
            callback();
        })
    },

    close: () => {
        ipcRenderer.send("close", {});
    }
})