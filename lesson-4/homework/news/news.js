const express = require("express"),
  app = express(),
  path = require("path"),
  // templating = require("consolidate"), //Поддержка шаблонизаторов
  cookieParser = require('cookie-parser'),
  hbs = require('hbs'); //Заменяет consolidate и делает ненужной строку app.engine("hbs", templating.handlebars);

const request = require("request"),
  cheerio = require("cheerio"),
  url = "https://rss.newsru.com/top/main/";
let categories = ['all', 'world', 'russia', 'sport'];

hbs.registerHelper('isSelected', (category, key) => {
  return category === key ? 'selected' : '';
});

// app.engine("hbs", templating.handlebars); //Выбираем функцию шаблонизации для hbs
app.set("view engine", "hbs"); //По умолчанию используем шаблоны hbs
app.set("views", path.resolve(__dirname, "views")); //Каталог с шаблонами

app.use('/styles', express.static(path.resolve(__dirname, 'assets')) );
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.all("/", (req, res, next) => {
  console.log("Receved request at /");
  res.send("Use ./news");
  next();
});

app.get("/news", (req, res) => {
  console.log("Receved GET request at /news");
  let newsObj = {
    cookies: {
      category: 'all',
      newsAmount: 5,
    },
    categoriesList: categories,
  };
  if (isObjEmpty(req.cookies)) {
    newsObj.cookies = {
      category: req.cookies.category,
      newsAmount: req.cookies.newsAmount,
    }
  }
  if (isObjEmpty(req.query)) {  //Приоритет передаваемым параметрам get-запроса
    if (req.query.category) {
      newsObj.cookies.category = req.query.category;
    }
    if (req.query.newsAmount) {
      newsObj.cookies.newsAmount = req.query.newsAmount;
    }
  }
  res.render('news', newsObj);
});

app.post("/news", (req, res) => {
  console.log("Receved POST request at /news");
  getNews(url)
    .then(newsObj => {
      return getFilteredNews(newsObj, req.body);
    })
    .then(filteredNewsObj => {
      res.cookie('category', filteredNewsObj.cookies.category, {maxAge: 1000*60*60*24*1, });
      res.cookie('newsAmount', filteredNewsObj.cookies.newsAmount, {maxAge: 1000*60*60*24*1, });
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
          renewNewsCategory(newsObj);
          resolve(newsObj);
        }
      }
    });
  });
}

function getFilteredNews(newsObj, data) {
    const filteredNewsObj = {
      news: [],
      cookies: {
        newsAmount: data.newsAmount,
        category: data.category,
      },
      categoriesList: categories,
    };

  for (let i = 0, counter = 0; i < newsObj.news.length && counter < +data.newsAmount; i++) {
    if (data.category === "all" || newsObj.news[i].category === data.category) {
      filteredNewsObj.news.push(newsObj.news[i]);
      counter++;
    }
  }
  return filteredNewsObj;
}

function isObjEmpty(obj) {
  if (Object.keys(obj).length > 0) {
    return true;
  }
  return false;
}

///////
function renewNewsCategory(newsObj) {
  newsObj.news.forEach(news => {
    if (!categories.includes(news.category)) {
      categories.push(news.category);
    }
  });
}