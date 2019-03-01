const fs = require("fs");
const parse = require("csv-parse");
const stringify = require("csv-stringify");

const {
    makeList,
    makeCourseLink,
    requirementsLink,
    languageLink
} = require('./entryReqUtils.js');

// Stream delarations
let streamIn = fs.createReadStream(__dirname + "/data/PG19Entry.csv");
let streamOut = fs.createWriteStream(__dirname + "/data/PGOut.csv");

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
    let { code, entryReq, process, language } = csvrow;
    code = code.trim();
    let quals = `<h4>Qualifications or experience</h4>\n${makeList(entryReq)}${requirementsLink(code)}`;
    let lang = `<h4>English language requirements</h4>\n${makeList(language)}${languageLink(code)}`;
    let selection = process
      ? `<h4>Selection process</h4>\n${makeList(process)}`
      : "";
    csvrow.summary = `${quals}\n\n${lang}\n\n${selection}`;
    console.log(csvrow);
    stringifier.write(csvrow);
  })
  .on("end", () => {
    streamOut.end();
  });
