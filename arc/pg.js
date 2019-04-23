const fs = require("fs");
const parse = require("csv-parse");
const stringify = require("csv-stringify");

const { makeList } = require('./entryReqUtils.js');

// Stream delarations
let streamIn = fs.createReadStream(__dirname + "/data/pg/simple.csv");
let streamOut = fs.createWriteStream(__dirname + "/data/pg/PGSimpleOut.csv");

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
    let { code, entryReq, language } = csvrow;
    code = code.trim();
    let quals = `<h5>Qualifications or experience</h5>\n${makeList(entryReq)}`;
    let lang = `<h5>English language requirements</h5>\n${makeList(language)}`;
    csvrow.summary = `${quals}\n\n${lang}`;
    console.log(csvrow);
    stringifier.write(csvrow);
  })
  .on("end", () => {
    streamOut.end();
  });
