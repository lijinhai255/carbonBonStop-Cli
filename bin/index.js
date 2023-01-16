#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const dedent = require("dedent");
const arg = hideBin(process.argv);
const cli = yargs(arg);
yargs(arg)
  .usage("Useage:carbonStop-cli [command] <options>")
  .demandCommand(
    1,
    "A command is required. Pass --help to see all available commands and options."
  )
  .strict()
  .alias("h", "help")
  .alias("v", "version")
  .wrap(cli.terminalWidth())
  .epilogue(
    dedent`
      When a command fails, all logs are written to lerna-debug.log in the current working directory.

      For more information, check out the docs at https://lerna.js.org/docs/introduction
    `
  )
  .options({
    debug: {
      type: "boolean",
      describe: "debugger code mode.",
      alias: "d",
    },
  })
  .option("registry", {
    type: "string",
    describe: "define global registry.",
    alias: "r",
  })
  .group(["debug"], "Dev Options:")
  .group(["registry"], "Publish Options:")
  .argv();
