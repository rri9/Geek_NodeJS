const request = require("request");
const argv = require("minimist")(process.argv);
const urlUtils = require("url");

const yaKey = "trnsl.1.1.20200121T040642Z.e9eb334bc1ded363.d7f5ecfb10168d32b6d1eeeae9829b472f4718d7";

// const req = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200121T040642Z.e9eb334bc1ded363.d7f5ecfb10168d32b6d1eeeae9829b472f4718d7&text=Hello&lang=ru&format=plain&options=1";
// console.log(urlUtils.parse(req));

// console.log(argv);
// console.log( argv._[3].replace("", ) );


let urlObj = {
protocol: 'https:',
hostname: 'translate.yandex.net',
pathname: '/api/v1.5/tr.json/translate',
  query: {
    key: yaKey,
    // text: encodeURI(argv._[3]),
    text: argv._[3],
    lang: argv._[2],
    format: "plain",
    options: 1,
  }
};
// console.log( urlUtils.format(urlObj) );


request({
  //request params
  method: "POST",
  uri: urlUtils.format(urlObj),
  // form: {
  //   key: yaKey,
  // },
}, (err, response, data) => {
    //api answer stuff
    if (err) {
      console.log(err);
    } else {
      console.log(response.statusCode);
      console.log(JSON.parse(data));
      
    }
});