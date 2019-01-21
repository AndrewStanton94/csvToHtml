const fs = require('fs');
const parse = require('csv-parse');
// const transform = require('stream-transform');
const stringify = require('csv-stringify')

let streamIn = fs.createReadStream(__dirname + '/UG19Entry.csv');
let streamOut = fs.createWriteStream(__dirname + '/UGOut.csv');

const stringifier = stringify();
stringifier.on('readable', () => {
  let row;
  while(row = stringifier.read()){
    streamOut.write(row);
  }
})
stringifier.on('error', (err) => {
  console.error(err.message)
})

streamIn.pipe(parse({columns: true}))
    .on('data', (csvrow) => {
        stringifier.write(csvrow);
    })
    .on('end', () => {
      	streamOut.end();
    });
