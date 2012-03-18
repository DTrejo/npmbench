module.exports = bench;

var fs = require('fs.extra');
var util = require('util');
var path = require('path');
var exec = require('child_process').exec;
var async = require('async');
var _ = require('underscore');
var colors = require('colors');
var npm = require('npm');
var metrics = require('metrics');

console.log('Storing downloaded modules in', __dirname.green);
var npmConfig = {
  loglevel: 'silent'
, cwd: __dirname + '/test_modules'
};

// returns an array of releases for that module
function releases(module, cb) {
    var silent = true;
    npm.commands.view([ module ], silent, function(err, data) {
        if (err) throw new Error(err.message);

        // json structure is wierd
        var newest = Object.keys(data)[0];
        var versions = data[newest].versions;
        return cb(null, versions);
    });
}

// install a single module. gets put in it's own module@version folder.
function install(module, version, cb) {
    var moduleAtVersion = module + '@' + version;
    // console.log('installing', moduleAtVersion);
    npm.commands.install([ moduleAtVersion ], function(err, data) {
        if (err) throw new Error(err.message);
        var source = path.join('./node_modules', module);
        var dest = path.join('./', moduleAtVersion);
        fs.move(source, dest, function(err) {
            if (err) {
                if (/(exists.)$/.exec(err.message)) ; // exists, ignore it!
                else throw new Error(err.message);
            }
            var win = true;
            cb(null, win);
        });
    });
}

// install all releases of given module
function npmInstallReleases(module, cb) {
    releases(module, onVersions);
    function onVersions(err, versions) {
        var tasks = {};
        versions.forEach(function(version) {
            tasks[version] = async.apply(install, module, version);
        });
        async.series(tasks, onInstalled);
    }
    function onInstalled(err, results) {
        console.log('all done installing stuff!');
        // console.log(util.inspect(results));
        cb(null, results);
    }
}

// benches js file at a single release, calls back with the stdout, also writes
// the stdout to a file called
//  ./npmbench-moduleName@x.y.z.txt
function benchRelease(module, version, file, cb) {
    var command = 'node ' + path.join(__dirname, file);
    var moduleAtVersion = module + '@' + version;
    var options = {
        cwd: moduleAtVersion
    };
    console.log('Running `'+command+'`, on', moduleAtVersion);
    exec(command, options, function(err, stdout, stderr) {

        // write bench output to file
        var file = txtFilename(module, version);
        fs.writeFile(file, stdout, 'utf8', function(writeErr) {
            if (writeErr) console.log(new Error(
                'Error writing bench output to '+file
                + '. ' + writeErr.message
            ).stack);

            cb(err, stdout, stderr);
        });
    });
}

// runs js file at each release
function benchReleases(module, versions, file, cb) {
    var tasks = {};
    versions.forEach(function(version) {
        // benchRelease(module, version, file, onBench);
        tasks[version] =
            async.apply(benchRelease, module, version, file);
    });
    async.series(tasks, cb);
}

function txtFilename(module, version) {
    return 'npmbench-' + module + '@' + version + '.txt';
}
function jsonFilename(module, version) {
    return 'npmbench-' + module + '@' + version + '.json';
}

// goes thru each ./npmbench-moduleName@x.y.z.txt file and extracts the
// graphable info, putting that info into ./npmbench-moduleName@x.y.z.json
// By default it looks at the end of every line for the following text:
// [...] 9001 ops/sec
// it then puts the average of these numbers into json
function parseAllOutputToJson(module, versions, cb) {
    var tasks = {};
    versions.forEach(function(version) {
        // benchRelease(module, version, file, onBench);
        var file = txtFilename(module, version);
        tasks[version] =
            async.apply(parseOutputToJson, module, version, file);
    });
    async.series(tasks, cb);
}

function parseOutputToJson(module, version, file, cb) {
    var raw = fs.readFileSync(file, 'utf8');
    var lines = raw.split('\n');
    var totalOps = new metrics.Histogram.createUniformHistogram();

    lines.forEach(function(l, i) {
        if (!l || !l.trim()) {
            // console.log('#ignored#', '>'+l+'<');
            return;
        }

        words = l.split(' ').filter(isWhiteSpace);
        ops = parseInt10(words.slice(-2, -1)[0])

        var isNaN = !ops && ops !== 0;
        if (isNaN) {
            // console.log('nan', l);
            return;
        }
        totalOps.update(ops);
    });

    console.log('Mean ops/sec:', totalOps.mean());
    var data = {
      mean: totalOps.mean()
    , stdDev: totalOps.stdDev()
    , raw: raw
    };

    var file = jsonFilename(module, version)
    return fs.writeFile(file, JSON.stringify(data), 'utf8', function(err) {
        cb(err, data);
    });

    function isWhiteSpace(s) {
        return !!s.trim();
    }
    function parseInt10(s) {
        return parseInt(s, 10);
    }
}

// looks through each ./npmbench-moduleName@x.y.z.json file, constructs a json
// object that can be graphed by some popular graphing lib
function jsonOutputToGraphFormat(module, releases) {

}

// prints a url to the generated graph. or just the path to the generated png
// or just an ascii graph to the command line.
function showGraph(graph) {

}

function bench(module, file, cb) {
    npm.load(npmConfig, function (err) {
        if (err) throw err;
        // TODO do stuff
        npm.on('log', function(message) {
            console.log(message);
        });
        npmInstallReleases(module, onInstalled);
    });
    function onInstalled(err, results) {
        if (err) throw err;

        var data = {}; // None yet. Sorry!
        cb && cb(null, data);
    }
    // how I want it to work
    // - my code downloads each release
    // - my code runs js file at each release
    // - my code saves output from each release to current directory
    // - my code or their code parses the output into json for each output file
    // - output json gets merged into one json blob that makes it easy to graph (same format at some other popular graphing library)
    // - gut service that takes graph in json format and graphs it for you to a url
}

if (require.main === module) {
    console.log('Running tests');

    npm.load(npmConfig, function (err) {
        if (err) throw err;
        test();
    });
}
function test() {
    var a = require('assert');
    // TODO do stuff

    var MODULE = 'gss';
    var VERSION = '0.1.1';
    var BENCHFILE = './test/bench.js';

    npm.on('log', function(message) {
        console.log(message);
    });

    install(MODULE, VERSION, function(err, data) {
       if (err) throw new Error(err.message);
       a(data);
    });

    releases(MODULE, function(err, versions) {
        a(Array.isArray(versions));
        a(versions.length);

        npmInstallReleases(MODULE, function(err, results) {
            // each version should have succeeded
            _.each(results, function(result, version) {
                a(result);
                // benchRelease(MODULE, version, BENCHFILE, onBench);
                // function onBench(err, output) {
                //     a(output);
                // }
            });

            benchReleases(MODULE, versions, BENCHFILE, function(err, results) {
                // each version should have succeeded
                _.each(results, function(result, version) {
                    a(result);
                });
                parseAllOutputToJson(MODULE, versions, function(err) {

                });
            });
        });
    });
};