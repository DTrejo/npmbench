#!/usr/bin/env node
var path = require('path');
var bench = require('./npmbench');

var module = (process.argv[2] || '').trim();
var file = (process.argv[3] || '').trim();
file = path.resolve(file);

if (!module || !file || !path.existsSync(file)) {
    console.log('Usage example:');
    console.log('    npmbench redis multi_bench.js');
    console.log('Note that the file you supply must exist.');
    console.log('(e.g. `multi_bench.js`)');
    return;
}

bench(module, file);
