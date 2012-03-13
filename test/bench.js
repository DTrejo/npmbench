// example of a js file that outputs the correct format
// bencher reads this file's output after this file is run at every release
// the output at each release is graphed
var fs = require('fs');
var path = require('path');

var output = fs.readFileSync(path.join(__dirname, '/test_output.txt'), 'utf8');
process.stdout.write(output);
