const fs = require("fs");
const parse = require("csv-parse");
const stringify = require("csv-stringify");

const { makeList } = require('./entryReqUtils.js');

// Stream delarations
let streamIn = fs.createReadStream(__dirname + "/data/pg/allPG.csv");
let streamOut = fs.createWriteStream(__dirname + "/data/pg/PGAllOut.csv");

// Setting up the write out code
const stringifier = stringify();
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
  .on("data", csvrow => {
    let { entryReq, process, language } = csvrow;
    let quals = `<h5>Qualifications or experience</h5>\n${makeList(entryReq)}`;
    let lang = `<h5>English language requirements</h5>\n${makeList(language)}`;
    let selection = process
      ? `\n\n<h5>Selection process</h5>\n${makeList(process)}`
      : "";
    csvrow.summary = `${quals}\n\n${lang}${selection}`;
    console.log(csvrow);
    stringifier.write(csvrow);
  })
  .on("end", () => {
    streamOut.end();
  });
