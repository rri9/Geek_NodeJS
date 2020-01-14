const argv = require("minimist")(process.argv);
const logger = require("./logger");
const lg = new logger(argv._[1], argv.log);

// let resArr = [];
// lg._readLog()
//   .then((res) => resArr = res)
//   .then(() => console.log(resArr));

lg.getSummary()
  .then((summary) => {
    console.log("in analyzer");
    console.log(summary);
  });
