rollup-plugin-sizes [![NPM Version](https://img.shields.io/npm/v/rollup-plugin-sizes.svg)](https://www.npmjs.com/package/rollup-plugin-sizes) [![Build Status](https://img.shields.io/travis/tivac/rollup-plugin-sizes/master.svg)](https://travis-ci.org/tivac/rollup-plugin-sizes)
===========
<p align="center">
    <a href="https://www.npmjs.com/package/rollup-plugin-sizes" alt="NPM License"><img src="https://img.shields.io/npm/l/rollup-plugin-sizes.svg" /></a>
    <a href="https://www.npmjs.com/package/rollup-plugin-sizes" alt="NPM Downloads"><img src="https://img.shields.io/npm/dm/rollup-plugin-sizes.svg" /></a>
    <a href="https://david-dm.org/tivac/rollup-plugin-sizes" alt="Dependency Status"><img src="https://img.shields.io/david/tivac/rollup-plugin-sizes.svg" /></a>
    <a href="https://david-dm.org/tivac/rollup-plugin-sizes#info=devDependencies" alt="devDependency Status"><img src="https://img.shields.io/david/dev/tivac/rollup-plugin-sizes.svg" /></a>
</p>

Simple analysis on rollup bundling, helping you to spot libaries bloating up your bundles.

```
Bundle Contents:
codemirror - 445.33 KB (33.68%)
remarkable - 189.54 KB (14.33%)
lodash._baseiteratee - 112.48 KB (8.51%)
app - 93.59 KB (7.08%)
autolinker - 81.63 KB (6.17%)
...
```

## Install

`$ npm i rollup-plugin-sizes -D`

## Usage

Add to your rollup build as the last plugin via JS API or Config file.

### JS API

```js
var rollup = require("rollup"),
    
    buble = require("rollup-plugin-buble"),
    sizes = require("rollup-plugin-sizes");

rollup.rollup({
    entry   : "src/main.js",
    plugins : [
        buble(),
        sizes()
    ]
}).then(function(bundle) {
    return bundle.write({
        format : "cjs",
        dest   : "dist/bundle.js"
    });
});
```

## Config file

```js
import buble from 'rollup-plugin-buble';
import sizes from 'rollup-plugin-sizes';

export default {
    entry   : "src/main.js",
    dest    : "dist/bundle.js",
    format  : "cjs",
    plugins : [
        buble(),
        sizes()
    ]
};
```
## A Note on Versioning ##

This project's version number currently has a "0.x" prefix, indicating that it's a young
project under heavy development. **As long as the version number starts with
"0.x", minor revisions may introduce breaking changes.**

You've been warned!

Once it reaches version 1.0.0, it will adhere strictly to [SemVer 2.0](http://semver.org/spec/v2.0.0.html).
