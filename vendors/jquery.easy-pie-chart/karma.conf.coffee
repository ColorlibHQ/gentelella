# Karma configuration
# http://karma-runner.github.io/0.10/config/configuration-file.html
module.exports = (config) ->
  config.set

    # base path, that will be used to resolve files and exclude
    basePath: ''

    # testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine']

    # list of files / patterns to load in the browser
    files: [
      'test/polyfills/bind.js'
      'bower_components/jquery/dist/jquery.js'
      'bower_components/angular/angular.js'
      'bower_components/angular-mocks/angular-mocks.js'
      'src/renderer/canvas.js'
      'src/easypiechart.js'
      'src/jquery.plugin.js'
      'src/angular.directive.js'
      'test/**/*.js'
    ]

    # list of files / patterns to exclude
    exclude: []

    # web server port
    port: 8080

    # level of logging
    # possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO

    # enable / disable watching file and executing tests whenever any file changes
    autoWatch: true

    # reporters
    reporters: ['progress', 'dots']

    # Start these browsers, currently available:
    # - Chrome
    # - ChromeCanary
    # - Firefox
    # - Opera
    # - Safari (only Mac)
    # - PhantomJS
    # - IE (only Windows)
    browsers: ['Chrome']

    # Continuous Integration mode
    # if true, it capture browsers, run tests and exit
    singleRun: false
