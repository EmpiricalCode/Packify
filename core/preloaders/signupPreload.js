// Constants
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("system", {

    promptLogin: () => {
        ipcRenderer.send("prompt-login");
    },

    signup: (data) => {
        ipcRenderer.send("signup", data);
    }
})