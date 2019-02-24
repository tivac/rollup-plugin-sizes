/* eslint-disable no-console */
"use strict";

const { rollup } = require("rollup");

rollup({
    input : "./test/specimens/entry.js",

    plugins : [
        require("../index.js")({
            details : true
        })
    ]
})
.then((bundle) => {
    bundle.generate({ format : "es" });
})
.catch((error) => {
    console.error(error.toString());

    process.exitCode = 1;
});
