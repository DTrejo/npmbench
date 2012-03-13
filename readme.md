npmbench
===

A command line tool to examine your code's performance over various releases.

- Downloads all releases
- runs the specified js file against all versions
- shows you a graph of your module's performance

Gotchas
---
- specialized for ops/sec
- the graphs are labeled for ops/sec
- bigger numbers are better (b/c more ops/sec is better) — my coloring choices
  align with this
- releases with incompatible APIs will likely throw errors when the js file is
  run, and will be omitted (set to 0).

Usage
---

Example usage for testing the [`redis`][1] package, and running the file `multi_bench.js` against each release:

```sh
npmbench redis multi_bench.js

# imaginary output:
Ops/sec
0.0.1 *****
0.0.2 *******
0.0.3 ********
0.0.4 ****
0.0.5 **********
```

Imaginary Niceties of this npmbench's approach
---
- Output from each run of your js file will be put into a file named
  `moduleName@x.y.z.txt`.
- These are then parsed into json files which are put at `moduleName@x.y.z.txt`
- all the json files are then put together to form a fat json blob that is
  graphable by [insert popular client-side graphing lib] and can be output to
  the command line as an ascii graph.

Why is this nice? Makes it easy to write your own parser / adapt your data to
the rest of the "data pipeline".

[1]: http://github.com/mranney/node_redis
