// Constants
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("system", {

    promptLogin: () => {
        ipcRenderer.send("prompt-login");
    }
})