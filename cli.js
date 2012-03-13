#!/usr/bin/env node
var bench = require('./npmbench');

var module = (process.argv[2] || '').trim();
var file = (process.argv[3] || '').trim();
if (!module || !file) {
    console.log('Usage:');
    console.log('    npmbench redis multi_bench.js');
    return;
}

bench(module, file);

console.log('Not yet 100% written! Sorry!');
