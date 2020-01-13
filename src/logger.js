const fs = require("fs");

class Logger {
  constructor(log) {
    if (log) {
      this.logFile = log;
    } else {
      this.logFile = "OrelReshkaDefault.log";
    }
    console.log(this.logFile);
  }
  startSession(userName) {

  }
}

module.exports = Logger;