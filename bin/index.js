#!/usr/bin/env node
const commander = require("commander");
const path = require("path");
const pkg = require("../package.json");
const log = require("npmlog");
const createFileFn = require("./createIndexScript.js");
const translateAndRenameFiles = require("./translate.js");
const copyFiles = require("./copyFile.js");
const renderedHTML = require("../ejs/index.js");
const { async } = require("rxjs");
const program = new commander.Command();
function registerCommand() {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage("<command> [options]")
    .version(pkg.version)
    .option("-d, --debug", "是否开启调试模式", false)
    .option("-tp, --targetPath <targetPath>", "是否指定本地调试文件路径", "")
    .option("-e, --ejsFilePath <ejsFilePath>", "是否指定翻译文件路径", "")
    .option(
      "-c, --createFilePath <createFilePath>",
      "是否指定创建模版文件路径",
      ""
    )
    .option(
      "-t, --translateFilePath <translateFilePath>",
      "是否指定翻译文件路径",
      ""
    );

  // 开启debug模式
  program.on("option:debug", function () {
    if (program.debug) {
      process.env.LOG_LEVEL = "verbose";
    } else {
      process.env.LOG_LEVEL = "info";
    }
    log.level = process.env.LOG_LEVEL;
  });

  // 指定targetPath
  program.on("option:targetPath", function () {
    process.env.CLI_TARGET_PATH = program.targetPath;
  });
  // 创建文件路径
  program.on("option:createFilePath", function (obj) {
    console.log(obj, path.join(process.cwd(), "mock"), "obj-obj");
    createFileFn(path.join(process.cwd(), obj));
  });
  // 制定翻译文件路径
  program.on("option:translateFilePath", (obj) => {
    console.log(obj, path.join(process.cwd(), obj));
    copyFiles(path.join(process.cwd(), obj), path.join(process.cwd(), "out"));
    translateAndRenameFiles(path.join(process.cwd(), "out"), "zh", "en");
  });
  // 制定ejs文件路径
  program.on("option:ejsFilePath", async (obj) => {
    console.log(obj, "renderedHTML:");
    await renderedHTML().then((data) => {
      console.log(data, "data=data");
    });
  });

  program.parse(process.argv);

  if (program.args && program.args.length < 1) {
    program.outputHelp();
    console.log();
  }
}
registerCommand();
