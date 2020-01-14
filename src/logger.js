const fs = require("fs");
const getDate = require("./getDate");
const path = require("path");
const readline = require("readline");

class Logger {
  constructor(parentFile, log) {
    // this.curDir = path.dirname(parentFile);
    if (log) {
      this.logFile = path.join(path.dirname(parentFile), log);
    } else {
      this.logFile = path.join(path.dirname(parentFile), "OrelReshkaDefault.log");
    }
    // console.log(this.logFile);
  }
  game(userName, result) {
    this._writeToLog(userName, result);
  }
  _writeToLog(userName, result) {
    fs.appendFile(
      this.logFile,
      `${getDate()} | ${userName} | ${result}\n`,
      { encoding: "utf8" },
      err => {
        if (err) {
          console.log(`${getDate()} Error writing log to ${this.logFile}`);
        }
      }
    );
  }
  async _readLog() {
    const resultArr = [];
    const rl = readline.createInterface({
      input: fs.createReadStream(this.logFile),
      crlfDelay: Infinity,
    });
    // rl.on("line", (line) => {
    //   resultArr.push( line.split(" | ") );
    // })
    for await (const line of rl) {
      resultArr.push(line.split(" | ")); //TODO Сразу обработать строку например _addToSummary
    }
    return resultArr;
  }
  getSummary() {
    const summary = [];
    return new Promise((resolve, reject) => {
      // let resArr = [];

      this._readLog()
        .then(resArr => {
          // console.log("in getSummary");
          // console.log(resArr);
          // resArr.map();
          resArr.forEach(line => {
            // console.log("in foreach");
            // console.log(line);
            this._summaryAddRes(summary, line);
          });
        })
        .then(() => {
          resolve(summary);
        });
    });
  }
  _summaryAddRes(summary, line) {
    console.log("in _summaryAddRes");
    
    console.log(line);
    if (!summary.hasOwnProperty(line[1])) {
      //еще нет в статистике такого юзера
      summary[line[1]] = {
        games: 1,
        winAmount: 0,
        lossAmount: 0,
        ratio: 0,
        winAtRow: 0, //текущее количество выигрышей подряд
        maxWinAtRow: 0,
        lossAtRow: 0, //текущее количество проигрышей подряд
        maxLossAtRow: 0,
        lastResult: "",
      };
    } else {
      summary[line[1]].games++;
    }

    // if (line[2] === "win") {
    //   summary[line[1]].winAmount++;
    //   if (summary[line[1]].lastResult === "win") {
    //     summary[line[1]].winAtRow++;
    //     if (summary[line[1]].winAtRow > summary[line[1]].maxWinAtRow) {
    //       summary[line[1]].maxWinAtRow = summary[line[1]].winAtRow;
    //     }
    //   } else {
    //     summary[line[1]].winAtRow = 1;
    //     summary[line[1]].lossAtRow = 0;
    //   }

    // } else if (line[2] === "loss") {
    //   summary[line[1]].lossAmount++;
    //   if (summary[line[1]].lastResult === "loss") {
    //     summary[line[1]].lossAtRow++;
    //     if (summary[line[1]].lossAtRow > summary[line[1]].maxLossAtRow) {
    //       summary[line[1]].maxLossAtRow = summary[line[1]].lossAtRow;
    //     }
    //   } else {
    //     summary[line[1]].lossAtRow = 1;
    //     summary[line[1]].winAtRow = 0;
    //   }
    // }
    if (line[2] === "win") {
      summary[line[1]].winAmount++;
      summary[line[1]].winAtRow++;
      summary[line[1]].lossAtRow = 0;
    } else {
      summary[line[1]].lossAmount++;
      summary[line[1]].lossAtRow++;
      summary[line[1]].winAtRow = 0;
    }
    if(summary[line[1]].lossAtRow > summary[line[1]].maxLossAtRow) {
      summary[line[1]].maxLossAtRow = summary[line[1]].lossAtRow;
    }
    if (summary[line[1]].winAtRow > summary[line[1]].maxWinAtRow) {
      summary[line[1]].maxWinAtRow = summary[line[1]].winAtRow;
    }

    // if (line[2] === summary[line[1]].lastResult) {
    //   summary[line[1]] [`${line[2]}AtRow`]++;
    // } else {
    //   summary[line[1]] [`${line[2]}AtRow`]++;
    // }


    summary[line[1]].ratio = Math.round( summary[line[1]].winAmount/summary[line[1]].games *100);
    summary[line[1]].lastResult = line[2];

    console.log(summary);
  }

  // _summaryCalcRatio(winAmount, lossAmount) {
  //   return Math.round( (winAmount / (winAmount+lossAmount) ) * 100);
  // }
}

module.exports = Logger;

/*
summary = [
  {
    userName: Gamer1,
    score: 2
  },
  {
    userName: Gamer2,
    score: 5
  }
]

summary = {
  Gamer1: {2, },    //userName: {games: 4, winAmount: 3, looses: 1, winAmount/looses: 33, winAtRow: 2, loosesAtRow: 1}
  Gamer2: [5, ]
}

*/
