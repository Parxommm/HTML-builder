const fs = require('fs');
const readline = require('readline');
const path = require('path');
const { stdin, stdout } = process;
const pathTextFile = path.join(__dirname, 'text.txt');
const rl = readline.createInterface(stdin, stdout);

fs.writeFile(path.join(pathTextFile), '', (error) => {
  if (error) throw error;
});

fs.readFile(pathTextFile, (error, data) => {
  if (error) return console.error(error.message);

  console.log(
    'Enter the text and press Enter to add it. To exit, press Ctrl+C or write "exit": ',
  );

  let notes = data;

  rl.on('SIGINT', () => {
    console.log('The data is saved, goodbye!');
    process.exit();
  });

  rl.on('line', (input) => {
    if (input === 'exit') {
      console.log('The data is saved, goodbye!');
      process.exit();
    }
    notes += input;

    fs.writeFile(pathTextFile, notes, (error) => {
      if (error) return console.error(error.message);
    });
  });
});
