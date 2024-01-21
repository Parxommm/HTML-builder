const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, 'files');
const folderCopy = path.join(__dirname, 'files-copy');

function copyDir() {
  fs.rm(folderCopy, { recursive: true }, () => {
    fs.mkdir(folderCopy, (error) => {
      if (error) return console.error(error.message);

      fs.readdir(folder, (error, files) => {
        if (error) return console.error(error.message);

        files.forEach((file) => {
          const filePath = path.join(folder, file);
          const filePathCopy = path.join(folderCopy, file);

          fs.copyFile(filePath, filePathCopy, 0, (error) => {
            if (error) return console.error(error.message);
          });

          console.log(`File ${filePathCopy} copied!`);
        });
      });
    });
  });
}

copyDir();
