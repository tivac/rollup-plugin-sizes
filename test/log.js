"use strict";

var util = require("util");

module.exports = () => {
    let out;

    function log(...args) {
        out += util.format(...args) + "\n";
    }

    beforeEach(() => (out = ""));

    return {
        log,
        out : () => out
    };
};
