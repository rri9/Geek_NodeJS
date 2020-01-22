console.log("Script loaded");

const request = require("request");
const cheerio = require("cheerio");
const url = "https://rss.newsru.com/top/main/";
const newsToDisplayAmount = 3;

request(url, (err, response, body) => {
  if (err) {
    console.log(`Request to ${url} error: ${err}`);
  } else {
    if (response.statusCode === 200) {
      const $ = cheerio.load(body,
        { xmlMode: true });
      const dates = [];
      const titles = [];
      const items = [];
      $("item").each((i, el) => {
        dates[i] = el.children[3].children[0].data;
        titles[i] = el.children[1].children[0].data;
        items[i] = el.children[7].children[0].children[0].data.replace(/&#34;/g, '"');
      })
      console.log('Первые 3 новости:');
      for (let i = 0; i < newsToDisplayAmount; i++) {
        console.log(`${dates[i]}\n${titles[i]}\n${items[i]}\n`);
      }
    }
  }
});
