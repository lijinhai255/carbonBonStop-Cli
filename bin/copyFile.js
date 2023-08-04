const fs = require("fs");
const path = require("path");

// const inputFolderPath = "/path/to/input"; // Replace with the path to your input folder
const outputFolderPath = path.join(process.cwd(), "out"); // Replace with the path to your output folder

function copyFiles(sourcePath, destinationPath) {
  try {
    // Read the content of the source folder
    const files = fs.readdirSync(sourcePath);

    // Iterate through each file and copy it to the destination folder
    for (const file of files) {
      const sourceFilePath = path.join(sourcePath, file);
      const destinationFilePath = path.join(destinationPath, file);

      // Check if it is a file or directory before copying
      const stat = fs.statSync(sourceFilePath);
      if (stat.isFile()) {
        fs.copyFileSync(sourceFilePath, destinationFilePath);
        console.log(`Copied: ${sourceFilePath} to ${destinationFilePath}`);
      } else if (stat.isDirectory()) {
        // Recursively copy directories
        fs.mkdirSync(destinationFilePath, { recursive: true });
        copyFiles(sourceFilePath, destinationFilePath);
      }
    }
  } catch (error) {
    console.error("Error occurred:", error.message);
  }
}

// Create the output folder if it doesn't exist
fs.mkdirSync(outputFolderPath, { recursive: true });

// Start copying files from input to output folder
// copyFiles(inputFolderPath, outputFolderPath);
module.exports = copyFiles;
