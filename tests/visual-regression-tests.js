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
    libraryRoot: fs.absolute(fs.workingDirectory + ''),
    screenshotRoot: fs.absolute(fs.workingDirectory + '/screenshots'),
    failedComparisonsRoot: fs.absolute(fs.workingDirectory + '/failures'),
    addLabelToFailedImage: true,

    /*
    screenshotRoot: '/screenshots',
    failedComparisonsRoot: '/failures'
    casper: specific_instance_of_casper,
    libraryRoot: '/phantomcss',
    fileNameGetter: function overide_file_naming(){},
    onPass: function passCallback(){},
    onFail: function failCallback(){},
    onTimeout: function timeoutCallback(){},
      onComplete: function completeCallback(){},
      hideElements: '#thing.selector',
      addLabelToFailedImage: true,
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
  casper.start();
  casper.viewport(1920, 1080);
  casper.thenOpen('http://localhost:3000/./production/index.html', function () {
    phantomcss.screenshot('body', 'index');
  });

  casper.then(function () {
    casper.click('.user-profile.dropdown-toggle');
    // wait for modal to fade-in
    casper.waitForSelector('li.open .user-profile.dropdown-toggle',
      function success() {
        phantomcss.screenshot('body', 'index-with-user-profile-dropdown');
      },
      function timeout() {
        casper.test.fail('Should see coffee machine');
      }
    );
  });
  casper.then(function () {
    casper.click('#cappuccino-button');
    phantomcss.screenshot('#myModal', 'cappuccino success');
  });
  casper.then(function () {
    casper.click('#close');
    // wait for modal to fade-out
    casper.waitForSelector('#myModal[style*="display: none"]',
      function success() {
        phantomcss.screenshot({
          'Coffee machine close success': {
            selector: '#coffee-machine-wrapper',
            ignore: '.selector'
          },
          'Coffee machine button success': '#coffee-machine-button'
        });
      },
      function timeout() {
        casper.test.fail('Should be able to walk away from the coffee machine');
      }
    );
  });
  casper.then(function now_check_the_screenshots() {
    // compare screenshots
    phantomcss.compareAll();
  });
  /*
  Casper runs tests
  */
  casper.run(function () {
    console.log('\nTHE END.');
    // phantomcss.getExitStatus() // pass or fail?
    casper.test.done();
  });
});
