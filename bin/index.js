#!/usr/bin/env node

const commander = require("commander");

const pkg = require("../package.json");
// 获取commander 单例
// const { program } = commander;
// new commander 实例
const program = new commander.Command();
program.version(pkg.version).parse(process.argv);
