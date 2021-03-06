const parse = require('csv-parse');
const transform = require('stream-transform');
const fs = require('fs');

const output = []

// Create the parser
const parser = parse({
	columns: true
})
// stream = fs.createReadStream(__dirname + '/UG19Entry.csv')
stream = fs.createReadStream(__dirname + '/UGtest.csv')

// Use the readable stream api
parser.on('readable', function(){
  let record
  while (record = parser.read()) {
    output.push(record)
  }
})

// Catch any error
parser.on('error', function(err){
  console.error(err.message)
})

// parser.on('end', function(){ })

// stream.pipe(parser.write);
// stream.pipe(process.stdout);
// // Write data to the stream
parser.write("root:x:0:0:root:/root:/bin/bash\n")
parser.write("someone:x:1022:1022::/home/someone:/bin/bash\n")
// Close the readable stream
parser.end()

console.log(output)
