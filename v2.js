const fs = require("fs");
const parse = require("csv-parse");
// const transform = require('stream-transform');
const stringify = require("csv-stringify");

let streamIn = fs.createReadStream(__dirname + "/UG19Entry.csv");
let streamOut = fs.createWriteStream(__dirname + "/UGOut.csv");

let makeList = (reqs, sep = "\n", tag = "ul", itemTags = "li") =>
  `<${tag}>\n${[
    ...reqs.split(sep).map(r => `<${itemTags}>${r}</${itemTags}>`)
  ].join("\n")}\n</${tag}>`;

const makeCourseLink = (code, text, year=2019) => `<a href="https://www.registryhub.port.ac.uk/entry_requirements/?course_code=${code}&year=${year}" target="_blank" title="Opens in a new tab">${text}</a>`
const requirementsLink = (code) => `\n<p>${makeCourseLink(code, 'See the other qualifications we accept')}</p>`;
const languageLink = (code) => `\n<p>${makeCourseLink(code, 'See alternative English language qualifications')}</p>`;

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

streamIn
  .pipe(parse({ columns: true }))
  .on("data", csvrow => {
    let { code, entryReq, process, language } = csvrow;
    code = code.trim();
    let quals = `<h5>Qualifications</h5>\n${makeList(entryReq)}${requirementsLink(code)}`;
    let lang = `<h5>Language</h5>\n${makeList(language)}${languageLink(code)}`;
    let selection = process
      ? `<h5>Selection Process</h5>\n${makeList(process)}`
      : "";
    csvrow.summary = `${quals}\n${lang}\n${selection}`;
    console.log(csvrow);
    stringifier.write(csvrow);
  })
  .on("end", () => {
    streamOut.end();
  });
