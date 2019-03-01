const processAFile = require('./core.js');

const utils = require('./entryReqUtils.js');

const {
    makeList,
    makeCourseLink,
    requirementsLink,
    languageLink
} = utils;

// Utility functions
processCSVRow = (csvrow) => {
    let { code, entryReq, process, language } = csvrow;
    code = code.trim();
    let quals = `<h5>Qualifications or experience</h5>\n${makeList(entryReq)}${requirementsLink(code)}`;
    let lang = `<h5>English language requirements</h5>\n${makeList(language)}${languageLink(code)}`;
    let selection = process
      ? `\n\n<h5>Selection process</h5>\n${makeList(process)}`
      : "";
    csvrow.summary = `${quals}\n\n${lang}${selection}`;
    console.log(csvrow);
    stringifier.write(csvrow);
};

processAFile({
    inputFile: '/PG19Entry.csv',
    outputFile: '/PGOut.csv',
    processCSVRow
});
