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
    
    describe("single-entry bundle", () => {
        it("should show basic output", () =>
            rollup({
                input : "./test/specimens/entry.js",

                plugins : [
                    require("../index.js")({
                        log
                    })
                ]
            })
            .then((bundle) => bundle.generate({ format : "es" }))
            .then(() => expect(out).toMatchSnapshot())
        );

        it("should show detailed output ", () =>
            rollup({
                input : "./test/specimens/entry.js",

                plugins : [
                    require("../index.js")({
                        log,

                        details : true
                    })
                ]
            })
            .then((bundle) => bundle.generate({ format : "es" }))
            .then(() => expect(out).toMatchSnapshot())
        );
    });
});
