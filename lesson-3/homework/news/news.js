console.log("Script loaded");

const request = require("request");
const cheerio = require("cheerio");
const url = "https://rss.newsru.com/top/main/";

request(url, (err, response, body) => {
  if (err) {
    console.log(`Request to ${url} error: ${err}`);
  } else {
    if (response.statusCode === 200) {
      // cheerio
      const $ = cheerio.load(body,
        {
          xml: {
            // normalizeWhitespace: true,
        }
        });
      const items = [];
      $("item").each((i, el) => {
        // console.log(i);
        // console.log(el);
        items[i] = el.children[7].children[0].children[0].data;
        debugger
      })
      console.log(items[0]);
      
      // let title1 = $("item").first();
      // console.log(title1);
      // debugger

    }
  }
});
