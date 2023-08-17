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
const getNetWorkDataFn = require("./getNetWorkData.js");
const { fileUploadFn, tarFileFn, sskFileUploadFn } = require("./execFn.js");
const program = new commander.Command();
program
  .name(Object.keys(pkg.bin)[0])
  .usage("<command> [options]")
  .version(pkg.version)
  .option("-d, --debug", "是否开启调试模式", false)
  .option("-e, --ejsFilePath <ejsFilePath>", "是否指定翻译文件路径", "")
  .option(
    "-c, --createFilePath <createFilePath>",
    "是否指定创建模版文件路径",
    ""
  )
  .option(
    "-translate, --translateFilePath <translateFilePath>",
    "是否指定翻译文件路径",
    ""
  )
  .option(
    "-temp, --templateFilePath <templateFilePath>",
    "是否指定复制文件路径",
    ""
  )
  .option("-tar, --tarFilePath <tarFilePath>", "是否指定压缩文件路径", "")
  .option("-ssh, --sshFilePath <sshFilePath>", "是否指定上传文件路径", "")
  .option("-net, --netWorkPath <netWorkPath>", "读取网页地址", "");

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
  copyFiles(path.join(process.cwd(), obj), path.join(process.cwd(), "out"));
  translateAndRenameFiles(path.join(process.cwd(), "out"), "zh", "en");
});
// 创建文件路径
program.on("option:templateFilePath", async function (obj) {
  if (obj) {
    // 1. 选择创建项目或组件
    const { type } = await inquirer.prompt({
      type: "list",
      name: "type",
      message: "请选择copy模版类型",
      default: "temp",
      choices: [
        {
          name: "移动端",
          value: "temp",
        },
        {
          name: "dct整合页面",
          value: "dct",
        },
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
  await renderedHTML().then((data) => {
    console.log(data, "data=data");
  });
});

// 压缩文件路径
program.on("option:tarFilePath", async (obj) => {
  tarFileFn(obj);
});
// 文件上传路径 打算上传的文件夹
program.on("option:sshFilePath", async (obj) => {
  console.log(obj, "sshFilePath=sshFilePath");
  await inquirer
    .prompt([
      {
        type: "list",
        name: "ssk",
        message: "是否使用私钥",
        choices: [
          {
            name: "是",
            value: "1",
          },
          {
            name: "否",
            value: "2",
          },
        ],
      },
    ])
    .then(async (data) => {
      if (data.ssk === "1") {
        const sskPath = await inquirer.prompt([
          { type: "input", name: "host", message: "请输入服务器地址或者IP" },
          { type: "input", name: "username", message: "请输入用户名" },
          { type: "input", name: "port", message: "请输入端口号" },
          { type: "input", name: "dstDir", message: "文件保存服务器地址" },

          {
            type: "input",
            name: "privateKey",
            message: "本地密钥地址",
          },
        ]);
        sskFileUploadFn(path.join(process.cwd(), obj), sskPath);
      }
      if (data.ssk === "2") {
        const answers = await inquirer.prompt([
          { type: "input", name: "host", message: "请输入服务器地址或者IP" },
          { type: "input", name: "port", message: "请输入端口号" },
          { type: "input", name: "dstDir", message: "文件保存服务器地址" },
          { type: "input", name: "username", message: "请输入用户名" },
          { type: "password", name: "password", message: "请输入密码" },
        ]);
        fileUploadFn(path.join(process.cwd(), obj), answers);
      }
    });
});
// 获取网页内容
program.on("option:netWorkPath", async (obj) => {
  console.log(obj, "netWorkPath=netWorkPath");
  const data = await getNetWorkDataFn(obj);
  console.log(data, "data-data");
});
program.parse(process.argv);
