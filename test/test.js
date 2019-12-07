/* eslint-disable no-console */
"use strict";

const { rollup } = require("rollup");

const plugin = require("../index.js");

describe("rollup-plugin-sizes", () => {
    let spy;

    beforeEach(() => {
        spy = jest.spyOn(global.console, "log");

        spy.mockImplementation(() => { /* NO-OP */ });
    });

    it.each([
        [ "single entry", "./test/specimens/entry.js" ],
        [ "multi-entry array", [
            "./test/specimens/entry.js",
            "./test/specimens/entry2.js",
        ]],
        [ "multi-entry object", {
            entry  : "./test/specimens/entry.js",
            entry2 : "./test/specimens/entry2.js",
        }],
    ])("should describe the sizes of a bundle (%s)", async (name, input) => {
        const bundle = await rollup({
            input,
        
            plugins : [
                plugin({
                    details : true,
                }),
            ],
        });

        await bundle.generate({ format : "es" });

        expect(spy).toHaveBeenCalled();
        expect(spy.mock.calls).toMatchSnapshot();
    });
});

