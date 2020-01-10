const argv = require("minimist")(process.argv);
const messages = {
  yes: ["y", "yes", "да"],
  goIn: "Сыграем в 'Орел и решка'?\n 'y' - да\n",
  goOut: "В следующий раз...",
  start: "Орел и решка!\nНачинаем игру!",
  askName: "Введите Ваше имя: ",
}

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
clearScreen();
console.log("========================");
// console.log(argv);
// console.log("==================");

rl.question(messages.goIn, (answ) => {
  if (isAgree(answ)) {
    // rl.close();
    start();
  } else {
    rl.close();
    console.log(messages.goOut);
  }
  
});

function clearScreen() {
  console.log('\x1Bc');
  // console.log("\x1Bc");
  process.stdout.write("\033c");
  // process.stdout.write("\x1Bc");
  // process.stdout.write("\x1B[2J");
  // process.stdout.write("\x1B[2J\x1B[0f");
  // process.stdout.write('\x1B[2J\x1B[0f\u001b[0;0H');
}

function isAgree(inp) {
  return (messages.yes.findIndex((el) => el === inp.toLowerCase()) === -1) ? false : true;
  // if ( messages.yes.findIndex((el) => el === inp.toLowerCase() ) === -1) {
  //   return false;
  // }
  // return true;
}

function start() {
  clearScreen();
  console.log(messages.start);
  const game = new OrelReshka();
  
  game.startGame();
  console.log(`${game.userName}, загадай орел или решку!`);
  
}

class OrelReshka {
  constructor() {
    this.userScore = 0;
    this.userName;
    this.pcScore = 0;
  }
  startGame() {
    this.askUserName();
  }
  async askUserName() {
    console.log("in askUserName()");
     rl.question(messages.askName, (name) => {
      console.log("in question");
      this.UserName = name;
    });
  }
  // get userName() {
  //   return this.userName;
  // }
}