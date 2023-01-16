#!/usr/bin/env node

const yargs = require("yargs/yargs");
const log = require("npmlog");
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
  .fail((msg, err) => {
    // certain yargs validations throw strings :P
    const actual = err || new Error(msg);

    // ValidationErrors are already logged, as are package errors
    if (actual.name !== "ValidationError" && !actual.pkg) {
      // the recommendCommands() message is too terse
      if (/Did you mean/.test(actual.message)) {
        log.error("lerna", `Unknown command "${cli.parsed.argv._[0]}"`);
      }

      log.error("lerna", actual.message);
    }

    // exit non-zero so the CLI can be usefully chained
    cli.exit(actual.exitCode > 0 ? actual.exitCode : 1, actual);
  })
  .recommendCommands()
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
  .command(
    "init [name]",
    "Do init a project",
    (yargs) => {
      yargs.option("name", {
        type: "string",
        describe: "Name of a project",
      });
    },
    (argv) => {
      console.log(argv);
    }
  )
  .command({
    command: "list",
    describe: "List local packages",
    aliases: ["ls", "la", "ll"],
    builder: (yargs) => {
      console.log(yargs);
    },
    handler: (argv) => {
      console.log(argv);
    },
  }).argv;
