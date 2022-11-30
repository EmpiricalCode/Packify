// Constants
const https = require('https');

// Functions
function request(host, path, data, callback) {

  var timedOut = false;
  
  // Constructing options
  const options = {
    
    host : host,
    path : path,
    method : "POST",
    headers : {
      "content-type" : "application/json"
    },
    timeout : 5000,
  }

  // Making request
  const req = https.request(options, (res) => {

    // Request is OK
    if (res.statusCode == 200) {

      var response_data = "";

      res.on("data", (chunk) => {
        response_data += chunk;
      })
  
      res.on("end", () => {
        try {
          const data = JSON.parse(response_data);
          callback(true, data);
        } catch {
          callback(false, {"error" : "Invalid JSON data was provided"});
        }
      })

    // Request is not OK
    } else {
      
      if (!timedOut) {
        callback(false, {"error" : `Request recieved status: ${res.statusCode}`});
      }
    }
  })

  // Writing data to request
  req.write(JSON.stringify(data));

  // Handling errors
  req.on('error', function (err) {
    callback(false, {"error" : err});
  })

  // Ending request on timeout
  req.on('timeout', () => {
    
    timedOut = true;
    req.end();
    
    callback(false, {"error" : "Request timed out (no response)"});
  });

  req.end();
}

module.exports.request = request;