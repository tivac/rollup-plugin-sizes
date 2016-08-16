"use strict";

var path = require("path"),
    
    assign   = require("lodash.assign"),
    each     = require("lodash.foreach"),
    sum      = require("lodash.sumby"),
    parse    = require("module-details-from-path"),
    filesize = require("filesize");
 
module.exports = function(options) {
    var data  = {},
        total = 0,
        base;

    if(!options) {
        options = false;
    }
    
    function add(details, size) {
        if(!(details.name in data)) {
            data[details.name] = [];
        }

        total += size;

        data[details.name].push(assign(details, { size : size }));
    }

    return {
        name : "rollup-plugin-sizes",

        options : function(config) {
            base = path.dirname(config.entry);
        },

        // Watch files as they're added
        transform : function(contents, file) {
            var details = parse(file) || {
                    name    : "app",
                    basedir : base,
                    path    : path.relative(base, file)
                };

            add(details, contents.length);
        },

        // Spit out stats during bundle generation
        ongenerate : function() {
            var totals = [];
            
            // Sum all files in each chunk
            each(data, function(files, name) {
                var size = sum(files, "size");
                
                totals.push({
                    name    : name,
                    size    : size,
                    percent : (size / total) * 100
                });
            });

            // Sort
            totals.sort(function(a, b) {
                return b.size - a.size;
            });

            console.log("Bundle Contents:");

            totals.forEach(function(item) {
                console.log(
                    "%s - %s (%s)",
                    item.name,
                    filesize(item.size),
                    item.percent.toFixed(2) + "%"
                );
            });
        }
    };
};
