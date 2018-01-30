"use strict";

var path = require("path"),

    each     = require("lodash.foreach"),
    sum      = require("lodash.sumby"),
    parse    = require("module-details-from-path"),
    filesize = require("filesize"),
    slash    = require("slash");

function defaultReport(details) {
    // Sort
    details.log("Details for \"%s:\"", details.bundle);
    
    details.totals
        .sort((a, b) => b.size - a.size)
        .forEach((item) => {
            details.log(
                "\t%s - %s (%s%%)",
                item.name,
                filesize(item.size),
                ((item.size / details.total) * 100).toFixed(2)
            );

            if(details.options.details) {
                details.data[item.name]
                    .sort((a, b) => b.size - a.size)
                    .forEach((file) => details.log(
                        "\t\t%s - %s (%s%%)",
                        slash(file.path),
                        filesize(file.size),
                        ((file.size / item.size) * 100).toFixed(2)
                    ));
            }
        });
}

module.exports = (options) => {
    var report, log, output, opts;

    if(!options) {
        options = false;
    }

    report = options.report || defaultReport;
    log    = options.log || console.log;

    return {
        name : "rollup-plugin-sizes",

        // Grab some needed bits out of the options
        options : (config) => {
            opts = Object.assign(Object.create(null), config);

            if(typeof opts.input === "string") {
                opts.input = [ opts.input ];
            }
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
                total  = 0,
                bundle = details.bundle.name || "bundle";
            
            if(output) {
                return false;
            }

            console.log(opts.input);
            console.log(details.bundle);

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
                            name    : bundle,
                            basedir : path.dirname(module.id),
                            path    : path.basename(module.id)
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

            if(opts.input.length === 1) {
                output = true;
            }

            return report({
                data,
                log,
                bundle,
                options,
                total,
                totals
            });
        }
    };
};
