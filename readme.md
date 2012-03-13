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
```

[1]: http://github.com/mranney/node_redis
