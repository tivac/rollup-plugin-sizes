"use strict";

var rollup  = require("rollup").rollup,
    
    plugin = require("../index.js");

describe("rollup-plugin-sizes", () => {
    describe("multiple-entry, single-output bundle", () => {
        var { log, out } = require("./log.js")();

        it("should show basic output", () =>
            rollup({
                input : [
                    "./test/specimens/many-to-1/a.js",
                    "./test/specimens/many-to-1/c.js",
                ],

                experimentalCodeSplitting : true,

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
                input : [
                    "./test/specimens/many-to-1/a.js",
                    "./test/specimens/many-to-1/c.js",
                ],

                experimentalCodeSplitting : true,

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

    describe("multiple-entry, single-output bundle w/ dynamic imports", () => {
        var { log, out } = require("./log.js")();

        it("should show basic output", () =>
            rollup({
                input : [
                    "./test/specimens/many-to-1/a.js",
                    "./test/specimens/many-to-1/e.js",
                ],

                experimentalCodeSplitting : true,
                experimentalDynamicImport : true,

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
                input : [
                    "./test/specimens/many-to-1/a.js",
                    "./test/specimens/many-to-1/e.js",
                ],

                experimentalCodeSplitting : true,
                experimentalDynamicImport : true,

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
