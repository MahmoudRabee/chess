//jshint strict: false
module.exports = function(config) {
    config.set({

        files: [
            'chess/libs/easel.js',
            'chess/libs/preload.js',
            'chess/libs/sound.js',
            'http://code.createjs.com/createjs-2014.12.12.min.js',
            'chess/bower_components/angular/angular.js',
            'chess/bower_components/angular-route/angular-route.js',
            'chess/bower_components/angular-mocks/angular-mocks.js',
            'chess/components/**/*.js',
            'chess/app.js',
            'chess/view/*.js',
            'chess/directives/*.js',
            'chess/services/*.js',
            'chess/classes/*.js',
            'chess/libs/socket.io.js',
            'unit-tests/chess/view/*.js',
            'unit-tests/chess/services/*.js',
            'unit-tests/chess/classes/*.js',
            'unit-tests/chess/directives/*.js'
        ],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-spec-reporter',
            'karma-junit-reporter'
        ],

        reporters: ['spec'],

        singleRun: true,

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }

    });
};
