const fse = require("fs-extra");
const path = require("path");

function copyTemplateFilesFn(targetPath, type) {
  const templatePath = path.resolve(__dirname, `../ejs/${type}`);
  console.log("templatePath:", templatePath, "targetPath:", targetPath);
  fse.ensureDirSync(templatePath);
  fse.ensureDirSync(targetPath);
  fse.copySync(templatePath, targetPath);
}

module.exports = copyTemplateFilesFn;
