const argv = require("minimist")(process.argv);
const messages = {
  yes: ["y", "yes", "да"],
  start: "Сыграем в 'Орел и решка'?\n 'y' - да\n"
}

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("==================");
// console.log(argv);
// console.log("==================");

rl.question(messages.start, (answ) => {
  if (isAgree(answ)) {
    startGame();
  } else {
    rl.close();
  }
  
});

function isAgree(inp) {
  // return ( messages.yes.findIndex(inp) > 0 ) ? true : false;
  console.dir(messages.yes);
  if (messages.yes.findIndex(inp) > 0) {
    console.log("inp= " + inp);
    return true;
  } else {
    return false;
  }
}

function startGame() {
  console.log("Starting Game...");
}

class OrelReshka {

}