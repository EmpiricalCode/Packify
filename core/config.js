// Constants
const os = require("os");

let app_data_path;

if (os.platform == "darwin") {
    app_data_path = `/Users/${os.userInfo().username}/Library/Application Support/Packify`;
} else {
    app_data_path = `/Users/${os.userInfo().username}/AppData/Local/Packify`;
}

// Main
module.exports = {
    "name" : "packify",
    "scheme" : "packify",
    "api_gateway_url" : "Packify-API-Gateway.empiricalcode.repl.co",
    "app_data_path" : app_data_path
}