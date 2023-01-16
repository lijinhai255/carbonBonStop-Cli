#!/usr/bin/env node
const argv = require("process").argv;
console.log("carbonSt121212op=cli", argv);
const command = argv[2];
const options = argv.slice(3);
let [option, params] = options;
console.log("command:", command, "option:", option, "params:", params);
//carbonStop-cli init --name vue-test
if (command.startsWith("--") || command.startsWith("-")) {
  const globalOption = command.replace(/--|-/g, "");
  console.log(globalOption);
  if (globalOption === "version" || globalOption === "V") {
    console.log("1.0.0");
  }
} else {
  option = option.replace("--", "");
  console.log(option, params);
}

// if (command) {
//   if (lib[command]) {
//     lib[command];
//   } else {
//     console.log("无效命令");
//   }
// } else {
//   console.log("");
// }
