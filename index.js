"use strict";

var path = require("path"),
    
    assign   = require("lodash.assign"),
    each     = require("lodash.foreach"),
    sum      = require("lodash.sumby"),
    parse    = require("module-details-from-path"),
    filesize = require("filesize");
 
module.exports = function(options) {
    var entry, base;

    if(!options) {
        options = false;
    }

    return {
        name : "rollup-plugin-sizes",

        // Grab some needed bits out of the options
        options : function(config) {
            entry = config.entry;
            base  = path.dirname(config.entry);
        },

        // Spit out stats during bundle generation
        ongenerate : function(details, result) {
            var data   = {},
                totals = [];

            details.bundle.modules.forEach(function(module) {
                var parsed = parse(module.id);
                
                if(!parsed) {
                    // Handle rollup-injected helpers
                    if(module.id.indexOf("\u0000") === 0) {
                        parsed = {
                            name    : "rollup helpers",
                            basedir : "",
                            path    : module.id.replace("\u0000", "")
                        };
                    } else {
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

                data[parsed.name].push(assign(parsed, { size : module.code.length }));
            });
            
            // Sum all files in each chunk
            each(data, function(files, name) {
                var size = sum(files, "size");
                
                totals.push({
                    name    : name,
                    size    : size,
                    percent : (size / result.code.length) * 100
                });
            });

            // Sort
            totals.sort(function(a, b) {
                return b.size - a.size;
            });

            console.log("%s:", entry);

            totals.forEach(function(item) {
                console.log(
                    "%s - %s (%s%%)",
                    item.name,
                    filesize(item.size),
                    item.percent.toFixed(2)
                );

                if(options.details) {
                    data[item.name].sort(function(a, b) {
                        return b.size - a.size;
                    })
                    .forEach(function(file) {
                        console.log(
                            "\t%s - %s (%s%%)",
                            file.path,
                            filesize(file.size),
                            ((file.size / item.size) * 100).toFixed(2)
                        );
                    });
                }
            });
        }
    };
};
