module.exports = function(grunt) {

    grunt.initConfig({
        jasmine_nodejs: {
            // task specific (default) options
            options: {
                useHelpers: true,
                // global helpers, available to all task targets. accepts globs..
                helpers: [],
                random: false,
                seed: null,
                defaultTimeout: null, // defaults to 5000
                stopOnFailure: false,
                traceFatal: true,
                // configure one or more built-in reporters
                reporters: {
                    console: {
                        colors: true,        // (0|false)|(1|true)|2
                        cleanStack: 1,       // (0|false)|(1|true)|2|3
                        verbosity: 4,        // (0|false)|1|2|3|(4|true)
                        listStyle: "indent", // "flat"|"indent"
                        activity: false
                    }

                },
                customReporters: []
            },
            your_target: {
                // target specific options
                options: {
                    useHelpers: true
                },
                // server files
                specs: [
                    "unit-tests/chess/server/*.spec.js"
                ],
                // target-specific helpers
                helpers: [
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-jasmine-nodejs');
};