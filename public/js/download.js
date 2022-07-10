const { ipcRenderer } = require("electron");

ipcRenderer.on("downloadargs", function(event, args){
    console.log(args);
})