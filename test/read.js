const fs = require('fs')

// stream = fs.createReadStream(__dirname + '/UG19Entry.csv')
stream = fs.createReadStream(__dirname + '/UGtest.csv')

stream.pipe(process.stdout);
