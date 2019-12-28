const ansi = require("ansi");
const cursor = ansi(process.stdout);

cursor.beep();

cursor.bg.grey().write("   ").write("\n");
// cursor.eraseLine();
cursor.horizontalAbsolute(5).write("5");
cursor.goto(10, 5).write("*");

// cursor
//   .bg.hex("#ff0000")  //red
//   .write("     ")
//   .bg.hex("#FF4500")  //orange
//   .write("     ")
//   .reset();
// displaying wrong hex colors!

cursor.write("\n")
cursor.hex('#FF0000').write("#FF0000");
cursor.hex('#00FF00').write("#00FF00");

cursor.reset();