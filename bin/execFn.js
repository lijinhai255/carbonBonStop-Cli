const { exec } = require("child_process");
const fs = require("fs");
const Client = require("ssh2-sftp-client");
function tarFileFn(folderName) {
  const tarFileName = `${folderName}.tar.gz`;

  exec(`tar -czvf ${tarFileName} ${folderName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`文件压缩失败: ${error.message}`);
      return;
    }
    console.log("文件压缩成功");
  });
}

// 文件上传
function fileUploadFn(tarFileName, answers) {
  const sftp = new Client();
  sftp
    .connect({
      ...answers,
    })
    .then(() => {
      return sftp.uploadDir(tarFileName, "/root/uploaded_files");
    })
    .then((data) => {
      console.log(data); // will be false or d, -, l (dir, file or link)
    })
    .then(() => {
      sftp.end();
    })
    .catch((err) => {
      console.error(err.message);
    });
}
// ssk 文件上传
function sskFileUploadFn(tarFileName, answers) {
  const sftp = new Client();
  sftp
    .connect({
      ...answers,
      privateKey: fs.readFileSync(answers.privateKey),
    })
    .then(() => {
      return sftp.uploadDir(tarFileName, "/root/uploaded_files");
    })
    .then((data) => {
      console.log(data); // will be false or d, -, l (dir, file or link)
    })
    .then(() => {
      sftp.end();
    })
    .catch((err) => {
      console.error(err.message);
    });
}

module.exports = {
  fileUploadFn,
  tarFileFn,
  sskFileUploadFn,
};
