/*jshint node: true */
module.exports = function(grunt) {
  var browsers = [{
      browserName: "iphone",
      platform: "OS X 10.8",
      version: "6"
  }, {
      browserName: "iphone",
      platform: "OS X 10.10",
      version: "9.2"
  }, {
      browserName: "android",
      platform: "Linux",
      version: "4.0"
  }, {
      browserName: "android",
      platform: "Linux",
      version: "4.4"
  }, {
      browserName: "android",
      platform: "Linux",
      version: "5.1"
  }, {
      browserName: "firefox",
      platform: "Windows 10"
  }, {
      browserName: "chrome",
      platform: "Windows 10"
  }, {
      browserName: "internet explorer",
      platform: "XP",
      version: "7"
  }, {
      browserName: "internet explorer",
      platform: "Windows 7",
      version: "8"
  }, {
      browserName: "internet explorer",
      platform: "Windows 7",
      version: "9"
  }, {
      browserName: "internet explorer",
      platform: "Windows 8",
      version: "10"
  }, {
      browserName: "internet explorer",
      platform: "Windows 10",
      version: "11"
  }, {
      browserName: "microsoftedge",
      platform: "Windows 10",
      version: "13.10586"
  }, {
      browserName: "opera",
      platform: "Windows 2008",
      version: "12"
  }, {
      browserName: "safari",
      platform: "OS X 10.8",
      version: "6"
  }, {
      browserName: "safari",
      platform: "OS X 10.9",
      version: "7"
  }, {
      browserName: "safari",
      platform: "OS X 10.10",
      version: "8"
  }, {
      browserName: "safari",
      platform: "OS X 10.11",
      version: "9"
  }];

  var tags = [];
  if (process.env.TRAVIS_PULL_REQUEST && process.env.TRAVIS_PULL_REQUEST != "false") {
    tags.push("pr" + process.env.TRAVIS_PULL_REQUEST);
  } else if (process.env.TRAVIS_BRANCH) {
    tags.push(process.env.TRAVIS_BRANCH);
  }

  grunt.initConfig({
      connect: {
          server: {
              options: {
                  base: "",
                  port: 9999
              }
          }
      },
      'saucelabs-qunit': {
          all: {
              options: {
                  urls: ["http://127.0.0.1:9999/test/index.html"],
                  tunnelTimeout: 5,
                  build: process.env.TRAVIS_JOB_ID,
                  concurrency: 3,
                  browsers: browsers,
                  testname: "qunit tests",
                  tags: tags
              }
          }
      },
      jshint: {
            options: {
                jshintrc: "./.jshintrc"
            },
            all: ['./lib/*.js']
        },
    browserify: {
      all: {
        files: {
          'dist/jszip.js': ['lib/index.js']
        },
        options: {
          browserifyOptions: {
            standalone: 'JSZip',
            insertGlobalVars : {
              Buffer: function () {
                // instead of the full polyfill, we just use the raw value
                // (or undefined).
                return '(typeof Buffer !== "undefined" ? Buffer : undefined)';
              }
            }
          },
          postBundleCB: function(err, src, done) {
            // add the license
            var license = require('fs').readFileSync('lib/license_header.js');
            // remove the source mapping of zlib.js, see #75
            var srcWithoutSourceMapping = src.toString().replace(/\/\/@ sourceMappingURL=raw..flate.min.js.map/g, '');
            done(err, license + srcWithoutSourceMapping);
          }
        }
      }
    },
    uglify: {
      options: {
        report: 'gzip',
        mangle: true,
        preserveComments: 'some'
      },
      all: {
        src: 'dist/jszip.js',
        dest: 'dist/jszip.min.js'
      }
    }
  });

  grunt.loadNpmTasks("grunt-saucelabs");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
    grunt.registerTask("test", ["connect", "saucelabs-qunit"]);
  } else {
    grunt.registerTask("test", []);
  }
  grunt.registerTask("build", ["browserify", "uglify"]);
  grunt.registerTask("default", ["jshint", "build"]);
};
