"use strict";

var rollup  = require("rollup").rollup,
    resolve = require("rollup-plugin-node-resolve"),
    
    plugin = require("../index.js"),
    
    // To silence rollup warnings
    external = [
        "fs",
        "path",
        "events",
        "module"
    ];

describe("rollup-plugin-sizes", () => {
    describe("node_modules support", () => {
        var { log, out } = require("./log.js")();

        it("should show basic output", () =>
            rollup({
                input : "./test/specimens/modules/a.js",

                external,

                plugins : [
                    resolve(),
                    plugin({
                        log
                    })
                ]
            })
            .then((bundle) => bundle.generate({ format : "es" }))
            .then(() => expect(out()).toMatchSnapshot())
        );

        it("should show detailed output ", () =>
            rollup({
                input : "./test/specimens/modules/a.js",

                external,

                plugins : [
                    resolve(),
                    plugin({
                        log,

                        details : true
                    })
                ]
            })
            .then((bundle) => bundle.generate({ format : "es" }))
            .then(() => expect(out()).toMatchSnapshot())
        );
    });
});
