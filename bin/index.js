#!/usr/bin/env node

const commander = require("commander");

const pkg = require("../package.json");
// 获取commander 单例
const { program } = commander;
// new commander 实例
// console.log(Object.keys(pkg.bin)[0], 12121212);
// const program = new commander.Command();

program
  .name(Object.keys(pkg.bin)[0])
  .usage("[command] <options>")
  .version(pkg.version)
  .option("-d,--debug", "是否开启调试模式", false)
  .option("-s, --separator <char>", "separator character", ",");
// .option("-f, --force <char>", "是否强制拷贝", ",")
// .command("clone <source> [destination]")
// .description("clone a repository into a newly created directory")
// .action((source, destination) => {
//   console.log("clone command called", source, destination);
// })

//  command 注册命令
// 通过绑定处理函数实现命令（这里的指令描述为放在`.command`中）
// 返回新生成的命令（即该子命令）以供继续配置
const clone = program.command("clone <source> [destination]");
clone
  .description("clone a repository into a newly created directory")
  .option("-f,--force", "是否强制克隆")
  .action((source, destination, cmdObj) => {
    console.log("clone command called", source, destination, cmdObj.force);
  });

// program
//   .command("clone <source> [destination]")
//   .description("clone a repository into a newly created directory")
//   .action((source, destination) => {
//     console.log("clone command called", source, destination);
//   });
// addCommand 注册命令
const service = new commander.Command("service");
service
  .command("start [port]")
  .description("start service at some port")
  .action((port) => {
    console.log("do service start", port);
  });
service
  .command("stop")
  .description("stop service at some port")
  .action(() => {
    console.log("stop service");
  });
program.addCommand(service);
program.parse(process.argv);
// program.opts();
program.outputHelp();
// console.log(program.opts().debug, program.opts(), "32");
