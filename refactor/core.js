const fs = require("fs");
const parse = require("csv-parse");
const stringify = require("csv-stringify");
const stringifier = stringify();

processAFile = ({
    inputFile,
    outputFile,
    processCSVRow
}) => {
    // Stream delarations
    let streamIn = fs.createReadStream(__dirname + inputFile);
    let streamOut = fs.createWriteStream(__dirname + outputFile);

    // Setting up the write out code
    stringifier.on("readable", () => {
      let row;
      while ((row = stringifier.read())) {
        streamOut.write(row);
      }
    });
    stringifier.on("error", err => {
      console.error(err.message);
    });

    // Take and processes data from input stream
    streamIn
      .pipe(parse({ columns: true }))
      .on("data", processCSVRow)
      .on("end", () => {
        streamOut.end();
      });
};

module.exports = processAFile;
