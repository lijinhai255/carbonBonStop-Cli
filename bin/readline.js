#!/usr/bin/env node

import readline from "readline";

debugger;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Are you sure? (y/n): ", (answer) => {
  if (answer === "y") {
    rl.close();
  }
});

// console.log(readline);
