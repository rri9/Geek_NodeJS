const argv = require("minimist")(process.argv);
const logger = require("./logger");

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

clearScreen();
console.log("========================");
// console.log(argv);
// console.log(argv.log);
rl.question("Сыграем в 'Орел и решка'?\n", answ => {
  if (isAgree(answ)) {
    rl.pause();
    const game = new OrelReshka();
    const lg = new logger(argv.log);
  } else {
    rl.close();
    console.log("В следующий раз...!");
  }
});

//----Functions----
function clearScreen() {
  console.log("\x1Bc");
  process.stdout.write("\033c");
}

function isAgree(inp) {
  return ["y", "yes", "да"].findIndex(el => el === inp.toLowerCase()) === -1 ? false : true;
}

class OrelReshka {
  constructor() {
    this.userScore = 0;
    this.pcScore = 0;
    this.userName;
    this.orel = ["o", "о"];
    this.reshka = ["p", "r", "р"];
    this.startGame();
  }
  startGame() {
    this._getUserName()
      .then(resolve => {
        this.userName = resolve;
        lg.startSession(this.userName);
      })
      .then(() => {
        console.log("\n\t'exit' - закончить игру.\n\nВыберите орел ('O') или решка ('Р'): ");
        rl.resume();
        rl.on("line", choise => {
          choise = this._normalizeUserInput(choise);
          switch (choise) {
            case "o":
            case "r":
              if (choise === this._getOrelReshka()) {
                console.log("Вы угадали!");
                this.userScore++;
              } else {
                console.log("Вы не угадали!");
                this.pcScore++;
              }
              break;
            case "exit":
              rl.close();
              this.exitGame();
              break;
            default:
              console.log("Введите орел ('O') или решка ('Р')");
              break;
          }
        });
      });
  }
  exitGame() {
    console.log(`\nОбщий счет игры: ${this.userName} - ${this.userScore}, PC - ${this.pcScore}.`);
    if (this.userScore > this.pcScore) {
      console.log("Вы выиграли!");
    } else if (this.userScore < this.pcScore) {
      console.log("Вы проиграли!");
    } else {
      console.log("Ничья!");
    }
  }
  _getUserName() {
    return new Promise((resolve, reject) => {
      rl.question("Введите свое имя: ", answ => {
        rl.pause();
        resolve(answ);
      });
    });
  }
  _normalizeUserInput(choise) {
    choise = choise.toLowerCase();
    if (this.orel.findIndex(el => el === choise) >= 0) {
      return "o";
    }
    if (this.reshka.findIndex(el => el === choise) >= 0) {
      return "r";
    }
    return choise.toLowerCase();
  }
  _getOrelReshka() {
    return Math.floor(Math.random() * 2) ? "o" : "r";
  }
}
