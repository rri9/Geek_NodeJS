const express = require("express"),
  app = express(),
  path = require("path"),
  templating = require("consolidate"); //Поддержка шаблонизаторов

const request = require("request"),
  cheerio = require("cheerio"),
  url = "https://rss.newsru.com/top/main/";

app.engine("hbs", templating.handlebars); //Выбираем функцию шаблонизации для hbs
app.set("view engine", "hbs"); //По умолчанию используем шаблоны hbs
app.set("views", path.resolve(__dirname, "views")); //Каталог с шаблонами

app.all("/", (req, res, next) => {
  console.log("Receved request at /");
  res.send("Use ./news");
  next();
});

app.get("/news", (req, res) => {
  console.log("Receved GET request at /news");
  getNews(url)
    .then(newsObj => {
      getFilterNews(newsObj, req.query);
    })
    .then(filteredNewsObj => {
      res.render("news", filteredNewsObj);
    });
});

app.listen(8000, () => {
  console.log("Server listenning on port 8000...");
});

function getNews() {
  return new Promise((resolve, reject) => {
    request(url, (err, response, body) => {
      if (err) {
        console.log(`Request to ${url} error: ${err}`);
      } else {
        if (response.statusCode === 200) {
          let newsObj = {
            news: [],
          };
          const $ = cheerio.load(body, { xmlMode: true });
          $("item").each((i, el) => {
            const news_item = {
              date: el.children[3].children[0].data,
              title: el.children[1].children[0].data,
              text: el.children[7].children[0].children[0].data.replace(/&#34;/g, '"'),
              category: el.children[9].children[0].data,
              link: el.children[5].children[0].data,
            };
            newsObj.news.push(news_item);
            // debugger;
          });
          resolve(newsObj);
        }
      }
    });
  });
}

function getFilterNews(newsObj, query) {
  return new Promise((resolve, reject) => {
    if (!query.newsAmount) {
      query.newsAmount = 10;
    }
    if (!query.category) {
      query.category = "all";
    }

    const filteredNewsObj = {
      news: [],
    };
    filteredNewsObj.news = newsObj.news.filter(el => {
      // debugger;
      if (el.category === query.category) {
        return true;
      }
    });
    debugger;
    console.log(filteredNewsObj);

    resolve(filteredNewsObj);
  });
}
// let newsObj = {
//   news: [
//     {
//       date: '2020/01/23',
//       title: 'Заголовок новости 1',
//       text: 'Текст новости 1',
//     },
//     {
//       date: '2020/01/20',
//       title: 'Заголовок новости 2',
//       text: 'Текст новости 2',
//     },
//   ]
// };
