// Constants
const crypto = require("crypto");

// Main
function hashString(string) {
    const salt = crypto.randomBytes(16).toString("base64");
    const hash = crypto.createHash('sha256').update(string + salt).digest('base64');

    return [salt, hash];
}

module.exports = hashString;