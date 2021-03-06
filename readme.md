npmbench
===

Install & Usage
---

```
npm install npmbench
```

Example: benchmarking the [`redis`][1] package, and running the file `multi_bench.js` against each release:

```sh
npmbench redis multi_bench.js

Ops/sec
*****      ( XX ops/sec ) v0.0.1
*******    ( XX ops/sec ) v0.0.2
********   ( XX ops/sec ) v0.0.3
****       ( XX ops/sec ) v0.0.4
********** ( XX ops/sec ) v0.0.5
```

A command line tool to examine your code's performance over various releases.

- Downloads all releases
- runs the specified js file against all versions
- shows you a graph of your module's performance (Note: this may or may not work depending on how your javascript file prints its results to stdout).

Gotchas
---
- specialized to read ops/sec from stdout

<!-- - the graphs are labeled for ops/sec -->
<!-- - bigger numbers are better (b/c more ops/sec is better) — my coloring choices
  align with this -->

- releases with incompatible APIs will likely throw errors when the js file is
  run, and will be omitted aka set to 0. If the error is more serious, things
  may just crash and I'm sorry.
  
Your bench should output something like this (even just one line that says `888 ops/sec` will work just fine):

```
[... whatever test output you like ...] 999.9 ops/sec
[... whatever test output you like ...] 999.9 ops/sec
[... whatever test output you like ...] 999.9 ops/sec
```
**Summary:** there must be at least one line, and the 2nd to last whitespace separated word must be a number representing the ops/sec.

in order to load the correct version of the module,
be sure to use the following pattern when requiring your module:
var gss;
if (process.env.npmbench) {
    gss = require('./');
    console.log('Currently running', require.resolve('./'));
} else {
    gss = require('gss');
}


Niceties of npmbench's approach
---
- Output from each run of your js file will be put into a file named
  `npmbench-moduleName@x.y.z.txt`. It skips running a given bench if there is
  already a .txt file there for it.
- These are then parsed into json files which are put at `npmbench-moduleName@x.y.z.json`
- makes it easy to run your own analysis of the numbers after all the benches
  have been run, or just grep through it :)

<!-- - all the json files are then put together to form a fat json blob that is
  graphable by [insert popular client-side graphing lib] and can be output to
  the command line as an ascii graph. -->

Why is this nice? Makes it easy to write your own parser for the output. 
<!-- / adapt your data to the rest of the "data pipeline". -->

TODO:

- graph the graph with something fancier than asterisks on the command line.
- split out the parsing stage so people can supply their own output parser (too
  much work?)
- actually write the thing that aggregates all the json blobs into one graphable
  json blob

[1]: http://github.com/mranney/node_redis
