console.log("Script loaded");

const request = require("request");
const cheerio = require("cheerio");
const url = "https://rss.newsru.com/top/main/";

request(url, (err, response, body) => {
  if (err) {
    console.log(`Request to ${url} error: ${err}`);
  } else {
    if (response.statusCode === 200) {
      console.log("Parse it!");
      
      // cheerio
    }
  }
});
