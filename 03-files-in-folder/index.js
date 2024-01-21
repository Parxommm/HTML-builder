const fs = require('fs');
const path = require('path');
let secretFolder = path.join(__dirname, 'secret-folder');

function geFilesInfo(currentPath) {
  fs.readdir(currentPath, { withFileTypes: true }, (error, files) => {
    if (error) return console.error(error.message);

    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(secretFolder, file.name);
        const fileExtname = path.extname(filePath);
        const fileName = path.basename(filePath, fileExtname);

        fs.stat(filePath, (error, stats) => {
          if (error) return console.error(error.message);
          const fileSize = stats.size;
          console.log(
            `${fileName} - ${replaceExtname(fileExtname)} - ${fileSize}b`,
          );
        });
      }
    });
  });
}

function replaceExtname(extname) {
  return extname.replace(/\./g, '');
}

geFilesInfo(secretFolder);
