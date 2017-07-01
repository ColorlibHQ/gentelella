var fs = require('fs');
var phantomcss = require('phantomcss');

function _onPass(test) {
  console.log('\n');
  var name = 'Should look the same ' + test.filename;
  casper.test.pass(name, { name: name });
}

function _onFail(test) {
  console.log('\n');
  var name = 'Should look the same ' + test.filename;
  casper.test.fail(name, { name: name, message: 'Looks different (' + test.mismatch + '% mismatch) ' + test.failFile });
}

casper.test.begin('Gentelella visual tests', function (test) {
  phantomcss.init({
    rebase: casper.cli.get("rebase"),
    // SlimerJS needs explicit knowledge of this Casper, and lots of absolute paths
    casper: casper,
    libraryRoot: fs.absolute(fs.workingDirectory + '/node_modules/phantomcss'),
    screenshotRoot: fs.absolute(fs.workingDirectory + '/tests/screenshots'),
    failedComparisonsRoot: fs.absolute(fs.workingDirectory + '/tests/failures'),
    addLabelToFailedImage: true,

    /*
    fileNameGetter: function overide_file_naming(){},
    onPass: function passCallback(){},
    onFail: function failCallback(){},
    onTimeout: function timeoutCallback(){},
    onComplete: function completeCallback(){},
    hideElements: '#thing.selector',
    outputSettings: {
      errorColor: {
        red: 255,
        green: 255,
        blue: 0
      },
      errorType: 'movement',
      transparency: 0.3
    }
    */
  });

  // CasperJS error handlers.
  casper.on('remote.message', function (msg) {
    this.echo(msg);
  });
  casper.on('error', function (err) {
    this.die("PhantomJS has errored: " + err);
  });
  casper.on('resource.error', function (err) {
    casper.log('Resource load error: ' + err, 'warning');
  });

  // The test scenario
  // Start test suite
  casper.start();
  casper.viewport(1920, 1080);

  // Test screenshot: index.html.
  casper.open('http://localhost:3000/./production/index.html', function () {
    phantomcss.screenshot('body', 'index');
  });

  // // index.html user-profile dropdown.
  casper.then(function () {
    casper.click('.user-profile');

    // wait for modal to fade-in
    casper.waitForSelector('li.open .user-profile.dropdown-toggle',
      function success() {
        phantomcss.screenshot('body', 'index-with-user-profile-dropdown');
      },
      function timeout() {
        casper.test.fail('Should see ');
      }
    );
  });

  // Test screenshot: login.html login-form.
  casper.thenOpen('http://localhost:3000/./production/index.html', function () {
    phantomcss.screenshot('body', 'login-form');
  });

  // Check all screenshots.
  casper.then(function now_check_the_screenshots() {
    // compare screenshots
    phantomcss.compareAll();
  });

  // Casper runs tests
  casper.run(function () {
    console.log('\nTHE END.');
    // phantomcss.getExitStatus() // pass or fail?
    casper.test.done();
  });
});
