const fs = require("fs");
const getDate = require("./getDate");
const path = require("path");
const readline = require("readline");

class Logger {
  constructor(parentFile, log) {
    if (log) {
      this.logFile = path.join(path.dirname(parentFile), log);
    } else {
      console.log("Using default log file OrelReshkaDefault.log");
      this.logFile = path.join(path.dirname(parentFile), "OrelReshkaDefault.log");
    }
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
    for await (const line of rl) {
      resultArr.push(line.split(" | "));
    }
    return resultArr;
  }
  getSummary() {
    const summary = {};
    return new Promise((resolve, reject) => {

      this._readLog()
        .then(resArr => {
          resArr.forEach(line => {
            this._summaryAddRes(summary, line);
          });
        })
        .then(() => {
          resolve(summary);
        });
    });
  }
  _summaryAddRes(summary, line) {
    if (!summary.hasOwnProperty(line[1])) { //еще нет в статистике такого юзера
      summary[line[1]] = {
        "Количество партий": 1, //Русский язык для последующего вывода
        "Выигрышей": 0,
        "Проигрышей": 0,
        "Процент побед": 0,
        winAtRow: 0, //текущее количество выигрышей подряд
        "Выигрышей подряд": 0,
        lossAtRow: 0, //текущее количество проигрышей подряд
        "Проигрышей подряд": 0,
        lastResult: "",
      };
    } else {
      summary[line[1]]["Количество партий"]++;
    }

    if (line[2] === "win") {
      summary[line[1]]["Выигрышей"]++;
      summary[line[1]].winAtRow++;
      summary[line[1]].lossAtRow = 0;
    } else {
      summary[line[1]]["Проигрышей"]++;
      summary[line[1]].lossAtRow++;
      summary[line[1]].winAtRow = 0;
    }
    if(summary[line[1]].lossAtRow > summary[line[1]]["Проигрышей подряд"]) {
      summary[line[1]]["Проигрышей подряд"] = summary[line[1]].lossAtRow;
    }
    if (summary[line[1]].winAtRow > summary[line[1]]["Выигрышей подряд"]) {
      summary[line[1]]["Выигрышей подряд"] = summary[line[1]].winAtRow;
    }

    summary[line[1]]["Процент побед"] = Math.round( summary[line[1]]["Выигрышей"]/summary[line[1]]["Количество партий"] *100);
    summary[line[1]].lastResult = line[2];
  }
}

module.exports = Logger;