const fs = require("fs");
const path = require("path");
const axios = require("axios");
const crypto = require("crypto");

const APP_ID = "20230726001758571";
const APP_KEY = "5vQdPlRR3m3UJikcj5Ju";
const BASE_URL = "http://api.fanyi.baidu.com/api/trans/vip/translate";

function generateSign(query, salt) {
  const str = APP_ID + query + salt + APP_KEY;
  const md5 = crypto.createHash("md5");
  return md5.update(str).digest("hex");
}

async function translateText(text, from, to) {
  const salt = Date.now().toString();
  const sign = generateSign(text, salt);

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: text,
        from: from,
        to: to,
        appid: APP_ID,
        salt: salt,
        sign: sign,
      },
    });

    return response.data.trans_result[0].dst;
  } catch (error) {
    console.error("Translation error:", error.message);
    return null;
  }
}

async function translateAndRenameFiles(
  folderPath,
  sourceLanguage,
  targetLanguage
) {
  console.log(folderPath, sourceLanguage, targetLanguage);
  try {
    const files = fs.readdirSync(folderPath);
    console.log(files);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      // Check if the file is an image (adjust extensions as needed)
      if (
        path
          .extname(file)
          .toLowerCase()
          .match(/\.(png|jpg|jpeg|gif|bmp)$/)
      ) {
        // Translate the filename
        const translatedFileName = await translateText(
          file,
          sourceLanguage,
          targetLanguage
        );
        if (translatedFileName) {
          const translatedFilePath = path.join(
            folderPath,
            translatedFileName.split(" ").join("")
          );

          // Rename the file
          fs.renameSync(filePath, translatedFilePath);
          console.log(`File ${file} renamed to ${translatedFileName}`);
        } else {
          console.log(`Translation failed for file ${file}`);
        }
      }
    }
  } catch (error) {
    console.error("Error occurred:", error.message);
  }
}

// Example usage:

module.exports = translateAndRenameFiles;
