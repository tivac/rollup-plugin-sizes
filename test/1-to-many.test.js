"use strict";

var rollup  = require("rollup").rollup,
    
    plugin = require("../index.js");

describe("rollup-plugin-sizes", () => {
    describe("single-entry, multiple-output bundle", () => {
        var { log, out } = require("./log.js")();

        it("should show basic output", () =>
            rollup({
                input : "./test/specimens/1-to-many/a.js",

                plugins : [
                    plugin({
                        log
                    })
                ]
            })
            .then((bundle) => Promise.all([
                bundle.generate({ format : "es" }),
                bundle.generate({ format : "cjs" })
            ]))
            .then(() => expect(out()).toMatchSnapshot())
        );

        it("should show detailed output ", () =>
            rollup({
                input : "./test/specimens/1-to-many/a.js",

                plugins : [
                    plugin({
                        log,

                        details : true
                    })
                ]
            })
            .then((bundle) => Promise.all([
                bundle.generate({ format : "es" }),
                bundle.generate({ format : "cjs" })
            ]))
            .then(() => expect(out()).toMatchSnapshot())
        );
    });
});
