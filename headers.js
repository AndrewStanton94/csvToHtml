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
let streamIn = fs.createReadStream(__dirname + "/data/headers.csv");
let streamOut = fs.createWriteStream(__dirname + "/data/headersOut.csv");

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
		let { code, entryReq, process, language, ucas } = csvrow;
		code = code.trim();

		let quals = `<h5>Qualifications or experience</h5>\n${makeList(entryReq)}${requirementsLink(code)}`;
		let lang = `<h5>English language requirements</h5>\n${makeList(language)}${languageLink(code)}`;
		let selection = process
			? `<h5>Selection process</h5>\n${makeList(process)}`
			: "";
		csvrow.entrySummary = `${quals}\n\n${lang}\n\n${selection}`;

		csvrow.apply = `
<p>To start in 2020 you need to apply through UCAS. You can register and start your application from 21 May 2019 and submit it from 5 September 2019.</p>
<p>In the meantime,&nbsp;<a href="~/link.aspx?_id=61E2B2EE23EC4E4E8A9FA892BFDFEAA9&amp;_z=z">sign up to an Open Day</a>&nbsp;to explore our course facilities, tour the campus and have a look around our halls of residence.</p>
<p>If you&rsquo;re new to the application process, read our guide on <a href="~/link.aspx?_id=663C261FF45E46679FD63CEF2E277201&amp;_z=z">applying for an undergraduate course</a>.</p>
<p>When you apply, you'll need:</p>
<ul>
	<li>the UCAS course code &ndash; ${ucas}</li>
	<li>our institution code &ndash; P80</li>
</ul>
`;
		console.log(csvrow);
		stringifier.write(csvrow);
	})
	.on("end", () => {
		streamOut.end();
	});
