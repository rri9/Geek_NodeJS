const request = require("request");

request("https://nodejs.org/api/http.html", (err, response, body) => {
  if (!err && response.statusCode === 200) {
    console.log(body);
    console.log("error: ", err);
    console.log(response);
    debugger
  }
});