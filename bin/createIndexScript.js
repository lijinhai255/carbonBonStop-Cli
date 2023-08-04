/*
 * @@description:
 */
const fs = require("fs");
const path = require("path");
const log = require("npmlog");
const renderedHTML = require("../ejs/index");
// 遍历每个文件夹并创建 index.tsx 文件

const createFileFn = (filePath) => {
  function createDefaultDirectory() {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
      createFilesInDefaultDirectory();
    } else {
      log.error(`${filePath}已经存在: ${filePath}`);
    }
  }

  // Function to create files with .tsx and .less extensions in the default directory
  async function createFilesInDefaultDirectory() {
    const tsxFile = path.join(filePath, "index.tsx");
    const lessFile = path.join(filePath, "index.module.less");
    await renderedHTML().then((data) => {
      fs.writeFileSync(tsxFile, data || "", "utf8");
    });
    fs.writeFileSync(lessFile, "", "utf8");

    console.log(`文件创建成功: index.tsx, index.module.less`);
  }
  createDefaultDirectory();
};

module.exports = createFileFn;
