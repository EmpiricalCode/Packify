// Constants
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("system", {

    promptSignUp: () => {
        ipcRenderer.send("prompt-signup");
    }
})