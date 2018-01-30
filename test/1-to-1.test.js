"use strict";

var rollup  = require("rollup").rollup,
    
    plugin = require("../index.js");

describe("rollup-plugin-sizes", () => {
    describe("single-entry, single-output bundle", () => {
        var { log, out } = require("./log.js")();

        it("should show basic output", () =>
            rollup({
                input : "./test/specimens/1-to-1/a.js",

                plugins : [
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
                input : "./test/specimens/1-to-1/a.js",

                plugins : [
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
