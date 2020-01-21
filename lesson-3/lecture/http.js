const http = require("http");
const https = require("https");
// let url = "https://nodejs.org/api/http.html";
let url = "https://ya.ru";

https.get(url, (res) => {
  // console.log(res);
  res.setEncoding("utf8");
  let rawData = '';
  res.on("data", (data) => {
    rawData += data;
    console.log(rawData);
  });
  res.on("end", () => {
    // const parsedData = JSON.parse(rawData);
    // console.log(parsedData);
  });
}).on("error", err => {
  console.log("Error: "+err);
})