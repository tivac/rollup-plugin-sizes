"use strict";

var rollup = require("rollup").rollup;

rollup({
    entry : "./test/specimens/entry.js",

    plugins : [
        require("../index.js")({
            details : true
        })
    ]
})
.then((bundle) => {
    bundle.generate({ format : "es" });
});
