// Constants
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("system", {

    promptSignUp: () => {
        ipcRenderer.send("prompt-signup");
    },

    login: (username, password) => {
        ipcRenderer.send("login", {"username" : username, "password" : password});
    },

    loginFinished: (callback) => {
        ipcRenderer.once("login-finished", (data) => {
            callback(data);
        });
    }
});