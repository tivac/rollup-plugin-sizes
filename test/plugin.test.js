"use strict";

var util = require("util"),
    
    rollup = require("rollup").rollup,
    
    plugin = require("../index.js");

describe("rollup-plugin-sizes", () => {
    let out;

    function log(...args) {
        out += util.format(...args) + "\n";
    }

    beforeEach(() => (out = ""));
    
    describe("single-entry, single-output bundle", () => {
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
            .then(() => expect(out).toMatchSnapshot())
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
            .then(() => expect(out).toMatchSnapshot())
        );
    });

    describe("single-entry, multiple-output bundle", () => {
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
            .then(() => expect(out).toMatchSnapshot())
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
            .then(() => expect(out).toMatchSnapshot())
        );
    });
});
