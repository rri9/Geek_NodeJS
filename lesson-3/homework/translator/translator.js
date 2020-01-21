const request = require("request");
const argv = require("minimist")(process.argv);
const urlUtils = require("url");

const yaKey = "trnsl.1.1.20200121T040642Z.e9eb334bc1ded363.d7f5ecfb10168d32b6d1eeeae9829b472f4718d7";

if (argv._[2] === undefined || argv._[3] === undefined) {
  console.log("Error: Script parameters are absent.");
  console.log('Basic usage:\ntranslator.js ru "Hello, World!"');
  process.exit();
}
if (argv._[4]) {
  console.log("Error: Too many script parameters.");
  console.log('Basic usage:\ntranslator.js ru "Hello, World!"');
  process.exit();
}

let urlObj = {
  protocol: "https:",
  hostname: "translate.yandex.net",
  pathname: "/api/v1.5/tr.json/translate",
  query: {
    key: yaKey,
    text: argv._[3],
    lang: argv._[2],
    format: "plain",
    options: 1,
  },
};

request(
  {
    method: "POST",
    uri: urlUtils.format(urlObj),
  },
  (err, response, data) => {
    if (err) {
      console.log(err);
    } else {
      const ans = JSON.parse(data);
      if (response.statusCode === 200 && ans.code === 200) {
        ans.text.forEach(text => {
          console.log(text);
        });
      }
    }
  }
);
