const fs = require('fs');
const path = require('path');
const stylesFolder = path.join(__dirname, 'styles');
const projectFolder = path.join(__dirname, 'project-dist');
const bundlePath = path.join(projectFolder, 'bundle.css');

fs.readdir(stylesFolder, { withFileTypes: true }, (error, files) => {
  if (error) return console.error(error.message);
  fs.writeFile(bundlePath, '', (error) => {
    if (error) return console.error(error.message);
  });

  const output = fs.createWriteStream(bundlePath);

  files.forEach((file) => {
    const pathFile = path.join(stylesFolder, file.name);
    const fileExtname = path.extname(pathFile);
    if (fileExtname === '.css') {
      const input = fs.createReadStream(pathFile, 'utf-8');
      input.pipe(output);
    } else {
      console.log(`File ${pathFile} is not HTML`);
    }
  });
  console.log(`File bundle.css created! ===> ${bundlePath}`);
});
