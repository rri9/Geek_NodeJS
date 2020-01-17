const argv = require("minimist")(process.argv);
const logger = require("./logger");
const lg = new logger(argv._[1], argv.log);

lg.getSummary()
  .then((summary) => {
    console.log(`Статистика игры 'Орел и решка'\nЛог: ${lg.logFile}\n`);
    console.table(summary, ["Количество партий", "Выигрышей", "Проигрышей", "Процент побед", "Выигрышей подряд", "Проигрышей подряд"]);
  });
