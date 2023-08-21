const fs = require("fs");
const path = require("path");
const tinify = require("tinify");
tinify.key = "4khSpntD0gkYy36H0ZpMBZPB5gp0GQyb"; // 将 YOUR_API_KEY 替换为您的 API 密钥

function compressImageFn(inputFolder) {
  const outputFolder = "output_folder"; // 输出文件夹

  // 创建输出文件夹（如果不存在）
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  // 获取输入文件夹中的所有文件
  const files = fs.readdirSync(inputFolder);

  // 遍历每个文件
  files.forEach(async (file) => {
    const filePath = path.join(inputFolder, file);
    const outputFilePath = path.join(outputFolder, file);

    // 压缩图片
    try {
      await tinify.fromFile(filePath).toFile(outputFilePath);
      console.log(`压缩并保存成功: ${outputFilePath}`);
    } catch (error) {
      console.error(`处理文件失败: ${filePath}`, error);
    }
  });
}
module.exports = compressImageFn;
