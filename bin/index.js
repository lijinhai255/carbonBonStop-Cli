#!/usr/bin/env node
const commander = require("commander");
const path = require("path");
const log = require("npmlog");
const inquirer = require("inquirer");
const createFileFn = require("./createIndexScript.js");
const translateAndRenameFiles = require("./translate.js");
const copyFiles = require("./copyFile.js");
const pkg = require("../package.json");
const renderedHTML = require("../ejs/index.js");
const copyTemplateFilesFn = require("./copyTemplate");
const program = new commander.Command();
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
    "-trans, --translateFilePath <translateFilePath>",
    "是否指定翻译文件路径",
    ""
  )
  .option(
    "-tem, --templateFilePath <templateFilePath>",
    "是否指定复制文件路径",
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
program.on("option:createFilePath", async function (obj) {
  console.log(obj, path.join(process.cwd(), "mock"), "obj-obj");
  createFileFn(path.join(process.cwd(), obj));
});
// 制定翻译文件路径
program.on("option:translateFilePath", (obj) => {
  console.log(obj, path.join(process.cwd(), obj));
  copyFiles(path.join(process.cwd(), obj), path.join(process.cwd(), "out"));
  translateAndRenameFiles(path.join(process.cwd(), "out"), "zh", "en");
});
// 创建文件路径
program.on("option:templateFilePath", async function (obj) {
  console.log(obj, path.join(process.cwd(), "obj"), "obj-obj");
  if (obj) {
    // 1. 选择创建项目或组件
    const { type } = await inquirer.prompt({
      type: "list",
      name: "type",
      message: "请选择copy模版类型",
      default: "list",
      choices: [
        {
          name: "列表页面",
          value: "list",
        },
        {
          name: "详情页面",
          value: "info",
        },
        {
          name: "弹窗",
          value: "Modal",
        },
        {
          name: "抽屉",
          value: "drawer",
        },
      ],
    });
    copyTemplateFilesFn(path.join(process.cwd(), obj), type);
  }
});
// 制定ejs文件路径
program.on("option:ejsFilePath", async (obj) => {
  console.log(obj, "renderedHTML:");
  await renderedHTML().then((data) => {
    console.log(data, "data=data");
  });
});

program.parse(process.argv);

// if (program.args && program.args.length < 1) {
//   program.outputHelp();
//   console.log();
// }
