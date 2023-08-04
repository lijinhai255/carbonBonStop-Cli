const ejs = require("ejs");
const path = require("path");
const fs = require("fs/promises");
// const renderedHTML = async () => {
//   return ejs.renderFile(
//     path.resolve(__dirname, "./index.html"),
//     data,
//     { debug: true },
//     function (err, str) {
//       console.error(err);
//       // str => 输出渲染后的 HTML 字符串
//       return str;
//     }
//   );
// };
const renderedHTML = async () => {
  try {
    // Read the EJS template content
    const templatePath = path.resolve(__dirname, "./index.html");
    const templateContent = await fs.readFile(templatePath, "utf-8");
    const data = { message: "Hello, EJS!" };
    const renderedContent = await ejs.render(templateContent, data);
    console.log(renderedContent, "renderedContent");
    // Return the rendered content
    return renderedContent;
  } catch (err) {
    console.error("Error:", err);
    return "";
  }
};

module.exports = renderedHTML;
