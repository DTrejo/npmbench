#!/usr/bin/env node

var colors = require('colors');
var fs = require('fs');
var _ = require('underscore');
var metrics = require('metrics');

//
// `node bencher.js before after`
//
var before = process.argv[2];
var after = process.argv[3];

if (!before || !after) {
    console.log('Please supply two file arguments:');
    console.log('    ./bencher.js multiBenchBefore.txt multiBenchAfter.txt');
    return;
}

var beforeLines = fs.readFileSync(before, 'utf8').split('\n');
var afterLines = fs.readFileSync(after, 'utf8').split('\n');

console.log('Comparing', before.green, '(', beforeLines.length ,')', 'to'
    , after.green, '(', afterLines.length, ')');

var totalOps = new metrics.Histogram.createUniformHistogram();

beforeLines.forEach(function(b, i) {
    var a = afterLines[i];
    if (!a || !b || !b.trim() || !a.trim()) {
        // console.log('#ignored#', '>'+a+'<', '>'+b+'<');
        return;
    }

    bWords = b.split(' ').filter(isWhiteSpace);
    aWords = a.split(' ').filter(isWhiteSpace);
    
    var ops = 
        [bWords, aWords]
        .map(function(words) {
            // console.log(words);
            return parseInt10(words.slice(-2, -1)); 
        }).filter(function(num) {
            var isNaN = !num && num !== 0;
            return !isNaN;
        });
    if (ops.length != 2) return
    
    var delta = ops[1] - ops[0];
    
    totalOps.update(delta);

    delta = humanizeDiff(delta);
    console.log(
        // name of test
        commandName(aWords) == commandName(bWords)
            ? commandName(aWords) + ':'
            : '404:',
        // results of test
        ops.join(' -> '), 'ops/sec (∆', delta, ')');
});

console.log('Mean difference in ops/sec:', humanizeDiff(totalOps.mean()));

function isWhiteSpace(s) {
    return !!s.trim();
}

function parseInt10(s) {
    return parseInt(s, 10);
}

// green if greater than 0, red otherwise
function humanizeDiff(num) {
    if (num > 0) {
        return ('+' + num).green
    }
    return ('' + num).red
}

function commandName(words) {
    var line = words.join(' ');
    return line.substr(0, line.indexOf(','));
}
