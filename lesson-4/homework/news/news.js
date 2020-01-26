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

app.use('/styles', express.static(path.resolve(__dirname, 'assets')) );
app.use(express.urlencoded({ extended: true }));

app.all("/", (req, res, next) => {
  console.log("Receved request at /");
  res.send("Use ./news");
  next();
});

app.get("/news", (req, res) => {
  console.log("Receved GET request at /news");
  res.render('news');
});

app.post("/news", (req, res) => {
  console.log("Receved POST request at /news");
  debugger
  getNews(url)
    .then(newsObj => {
      return getFilteredNews(newsObj, req.body);
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
          });
          resolve(newsObj);
        }
      }
    });
  });
}

function getFilteredNews(newsObj, data) {
    const filteredNewsObj = {
      news: [],
    };

  for (let i = 0, counter = 0; i < newsObj.news.length && counter < +data.newsAmount; i++) {
    if (data.category === "all" || newsObj.news[i].category === data.category) {
      filteredNewsObj.news.push(newsObj.news[i]);
      counter++;
    }
  }
  return filteredNewsObj;
}
