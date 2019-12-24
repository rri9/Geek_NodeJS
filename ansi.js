const ansi = require("ansi");
const cursor = ansi(process.stdout);

cursor.beep();


// cursor.bg.grey().write("   ").write("\n");
// // cursor.eraseLine();
// cursor.horizontalAbsolute(5).write("5");
// cursor.goto(10, 5).write("10, 5");

function cursorPrint(str, color, bgColor, x, y, ) {
  cursor.goto(x, y).red().bg.green().write(str);
  cursor.reset();
}

// cursor
//   .bg.hex("#ff0000")  //red
//   .write("     ")
//   .bg.hex("#FF4500")  //orange
//   .write("     ")
//   .reset();

// cursorPrint("hello", "red", "green", 5, 2);

// cursor.hex('#FF0000').write("#FF0000");
// cursor.hex('#00FF00').write("#00FF00");

let col = "grey()";
// `cursor.bg.${col}.write('123')`;
// `${cursor.bg.grey().write('123').bg.red().write('456')}`;
let str = `${cursor.bg.grey().write('123').bg.red().write('456')}`;
console.log(str);
str += ".bg.blue().write('789')";
console.log(str);
str;

cursor.reset();