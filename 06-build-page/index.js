const fs = require('fs/promises');
const { createWriteStream } = require('fs');
const { createReadStream } = require('fs');
const path = require('path');
const projectFolder = path.join(__dirname, 'project-dist');
const assets = path.join(__dirname, 'assets');
const assetsCopy = path.join(projectFolder, 'assets');
const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(projectFolder, 'style.css');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const resultHTML = path.join(projectFolder, 'index.html');

async function updateDirectory(dirName) {
  try {
    await fs.rm(dirName, { recursive: true });
    await fs.mkdir(dirName, { recursive: true });
  } catch (error) {
    await fs.mkdir(dirName, { recursive: true });
  } finally {
    console.log('Folder updated: ', dirName);
  }
}

async function copyDir(pathFolder, targetFolder) {
  await fs.mkdir(targetFolder);
  const files = await fs.readdir(pathFolder, { withFileTypes: true });
  files.forEach((file) => {
    try {
      const fileName = path.join(pathFolder, file.name);
      const fileNameCopy = path.join(targetFolder, file.name);
      if (file.isDirectory()) {
        copyDir(fileName, fileNameCopy);
      } else if (file.isFile()) {
        fs.copyFile(fileName, fileNameCopy);
        console.log(`File ${fileNameCopy} copied!`);
      }
    } catch (error) {
      console.log(error);
    }
  });
}

async function mergeStyles(dirStyles, bundle) {
  const styles = await fs.readdir(dirStyles, { withFileTypes: true });
  await fs.writeFile(bundle, '');
  const output = createWriteStream(bundle);

  styles.forEach((style) => {
    const pathFile = path.join(dirStyles, style.name);
    const fileExtname = path.extname(pathFile);
    if (fileExtname === '.css') {
      const input = createReadStream(pathFile, 'utf-8');
      input.pipe(output);
    }
  });
  console.log(`File bundle.css created! ===> ${bundle}`);
}

async function createHTML(template, dirComponents) {
  try {
    let dataTemplate = await fs.readFile(template, 'utf-8');
    const files = await fs.readdir(dirComponents, { withFileTypes: true });
    for (const file of files) {
      const pathFile = path.join(componentsPath, file.name);
      const extnameFile = path.extname(pathFile);
      const nameFile = path.basename(pathFile, extnameFile);
      if (extnameFile === '.html') {
        const dataFile = await fs.readFile(pathFile, 'utf-8');
        dataTemplate = await dataTemplate.replaceAll(
          `{{${nameFile}}}`,
          dataFile,
        );
      } else {
        console.log(`File ${pathFile} is not HTML`);
      }
    }
    await fs.writeFile(resultHTML, dataTemplate);
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  await updateDirectory(projectFolder);
  await copyDir(assets, assetsCopy);
  await mergeStyles(stylesPath, bundlePath);
  await createHTML(templatePath, componentsPath);
  console.log('<<<===The project is compiled!===>>>');
})();
