const fs = require('fs');
const parse = require('csv-parse');
// const transform = require('stream-transform');
const stringify = require('csv-stringify')

let streamIn = fs.createReadStream(__dirname + '/UG19Entry.csv');
let streamOut = fs.createWriteStream(__dirname + '/UGOut.csv');

let makeList = (reqs, sep = '\n', tag = 'ul', itemTags = 'li') => `<${tag}>\n${[...reqs.split(sep).map((r) => `<${itemTags}>${r}</${itemTags}>`)].join('\n')}\n</${tag}>`

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
		let {entryReq, process} = csvrow;
		let quals = `<p>Qualifications</p>\n${makeList(entryReq)}`;
		let selection = `<p>Selection Process</p>\n${makeList(process)}`;
		csvrow.summary = `${quals}\n${selection}`;
		console.log(csvrow);
		stringifier.write(csvrow);
	})
	.on('end', () => {
		streamOut.end();
	});
