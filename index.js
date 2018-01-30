"use strict";

var path = require("path"),

    each     = require("lodash.foreach"),
    sum      = require("lodash.sumby"),
    parse    = require("module-details-from-path"),
    filesize = require("filesize");

function defaultReport(details) {
    // Sort
    details.totals.sort((a, b) => b.size - a.size);
    
    details.log("%s:", details.input);

    details.totals.forEach((item) => {
        details.log(
            "%s - %s (%s%%)",
            item.name,
            filesize(item.size),
            ((item.size / details.total) * 100).toFixed(2)
        );

        if(details.options.details) {
            details.data[item.name]
                .sort((a, b) => b.size - a.size)
                .forEach((file) => details.log(
                    "\t%s - %s (%s%%)",
                    file.path,
                    filesize(file.size),
                    ((file.size / item.size) * 100).toFixed(2)
                ));
        }
    });
}

module.exports = (options) => {
    var input, base, report, log, output;

    if(!options) {
        options = false;
    }

    report = options.report || defaultReport;
    log    = options.log || console.log;

    return {
        name : "rollup-plugin-sizes",

        // Grab some needed bits out of the options
        options : (config) => {
            input = config.input;
            base  = path.dirname(config.input);
        },

        // Don't actually provide a load hook, just use it to reset the output
        // flag every time the build is re-run
        load : () => {
            output = false;
        },

        // Spit out stats during bundle generation
        ongenerate : (details) => {
            var data   = {},
                totals = [],
                total = 0;
            
            if(output) {
                return false;
            }

            details.bundle.modules.forEach((module) => {
                var parsed;

                // Handle rollup-injected helpers
                if(module.id.indexOf("\u0000") === 0) {
                    parsed = {
                        name    : "rollup helpers",
                        basedir : "",
                        path    : module.id.replace("\u0000", "")
                    };
                } else {
                    parsed = parse(module.id);

                    if(!parsed) {
                        parsed = {
                            name    : "app",
                            basedir : base,
                            path    : path.relative(base, module.id)
                        };
                    }
                }

                if(!(parsed.name in data)) {
                    data[parsed.name] = [];
                }

                data[parsed.name].push(Object.assign(parsed, { size : module.code.length }));
            });

            // Sum all files in each chunk
            each(data, (files, name) => {
                var size = sum(files, "size");

                total += size;

                totals.push({
                    name,
                    size
                });
            });

            output = true;

            return report({
                input,
                data,
                totals,
                total,
                options,
                log
            });
        }
    };
};
