module.exports = bench

var async = require('async');
var npm = require('npm');
var npmConfig = { 
      loglevel: 'silent'
    , cwd: __dirname + '/test_modules'
};

// returns an array of releases for that module
function releases(module) {
    return [ '0.0.1' ];
}

// install a single module
function install(moduleAtVersion, cb) {
    npm.commands.install([ moduleAtVersion ], cb);
}

// install all releases of given module
function npmInstallReleases(module, cb) {
    releases(module, function(versions) {
       versions.forEach(function(version) {
           var moduleAtVersion = module+'@'+version;
           install(moduleAtVersion, function(err, data) {
               if (err) throw new Error(err.message);
               // etc
           });
           // TODO use async.parallel, reduce nesting.
           // cb()
       });
    });
}

// benches js file at a single release, calls back with the stdout
function benchRelease(module, release, cb) {
    
}

// runs js file at each release, puts the output into
//  ./npmbench-moduleName@x.y.z.txt
function benchReleases(module, releases) {
    
}

// goes thru each ./npmbench-moduleName@x.y.z.txt file and extracts the relevant
// info, putting that info into ./npmbench-moduleName@x.y.z.json
function parseBenchOutputIntoJson(module, releases) {
    
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
      // npm.on('log', function (message) { .... })
    })
    
    // how I want it to work
    // - my code downloads each release
    // - my code runs js file at each release
    // - my code saves output from each release to current directory
    // - my code or their code parses the output into json for each output file
    // - output json gets merged into one json blob that makes it easy to graph (same format at some other popular graphing library)
    // - gut service that takes graph in json format and graphs it for you to a url
    
    var data = {}; // None yet. Sorry!
    cb && cb(null, data);
}
