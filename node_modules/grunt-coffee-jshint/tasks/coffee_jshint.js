/*
 * grunt-coffee-jshint
 * https://github.com/bmac/grunt-coffee-jshint
 *
 * Copyright (c) 2013 bmac
 * Licensed under the MIT license.
 */

'use strict';

var hintFiles = require("coffee-jshint/lib-js/hint");


module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('coffee_jshint', 'grunt wrapper for coffee-jshint', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            jshintOptions: [],
            withDefaults: true,
            globals: []
        });
        var files = this.filesSrc;

        var errors = files.map(function(path) {
            return hintFile(path, options);
        });
         
        var hasErrors = (/:/.test('\n' + errors.join('\n\n') + '\n'));
        if (hasErrors) {
            grunt.fail.warn('\n' + errors.join('\n\n') + '\n');
        }

    });

    var hintFile = function(path, options) {

        var errors = hintFiles([path],
                               {options: options.jshintOptions,
                                withDefaults: options.withDefaults,
                                globals: options.globals},
                               false);
        var flattened_errors = [].concat.apply([], errors);
        var formatted_errors = flattened_errors.map(function(error) {
            return '' + path + ': ' + error.line + ":" + error.character + " " + error.reason;
        });

        return formatted_errors.join('\n');
    };

};
