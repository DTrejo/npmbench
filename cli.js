#!/usr/bin/env node
var bench = require('./npmbench');

var module = (process.argv[2] || '').trim();
var file = (process.argv[3] || '').trim();
if (!module || !file) {
    console.log('Usage:');
    console.log('    npmbench redis multi_bench.js');
    return;
}


console.log('== Not yet 100% written! Sorry! ==');

// TODO: check for existence of file.
bench(module, file);
