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
    addIteratorToImage: false,
    mismatchTolerance: 0.05,
    onFail: _onFail,
    onPass: _onPass,
    outputSettings: {
      errorColor: {
        red: 255, green: 255, blue: 0
      },
      errorType: 'movement',
      transparency: 0.3
    },
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
        casper.test.fail('Should see user profile dropdown.');
      }
    );
  });

  // Test screenshot: login.html login-form.
  casper.thenOpen('http://localhost:3000/./production/login.html', function () {
    phantomcss.screenshot('body', 'login-form');
  });

  // Test screenshot: login.html register-form.
  casper.then(function () {
    casper.click('.to_register');

    // wait for modal to fade-in
    casper.wait(1000,
      function done() {
        phantomcss.screenshot('body', 'register-form');
      }
    );
  });

  // Test screenshot: calendar.html
  casper.thenOpen('http://localhost:3000/./production/calendar.html', function () {
    phantomcss.screenshot('body', 'calendar');
  });

  // Test screenshot: chartjs.html
  casper.thenOpen('http://localhost:3000/./production/chartjs.html', function () {
    phantomcss.screenshot('body', 'chartjs');
  });

  // Test screenshot: contacts.html
  casper.thenOpen('http://localhost:3000/./production/contacts.html', function () {
    phantomcss.screenshot('body', 'contacts');
  });

  // Test screenshot: echarts.html
  casper.thenOpen('http://localhost:3000/./production/echarts.html', function () {
    phantomcss.screenshot('body', 'echarts');
  });

  // Test screenshot: e_commerce.html
  casper.thenOpen('http://localhost:3000/./production/e_commerce.html', function () {
    phantomcss.screenshot('body', 'e_commerce');
  });

  // Test screenshot: fixed_footer.html
  casper.thenOpen('http://localhost:3000/./production/fixed_footer.html', function () {
    phantomcss.screenshot('body', 'fixed_footer');
  });

  // Test screenshot: fixed_sidebar.html
  casper.thenOpen('http://localhost:3000/./production/fixed_sidebar.html', function () {
    phantomcss.screenshot('body', 'fixed_sidebar');
  });

  // Test screenshot: form_advanced.html
  casper.thenOpen('http://localhost:3000/./production/form_advanced.html', function () {
    phantomcss.screenshot('body', 'form_advanced');
  });

  // Test screenshot: form_buttons.html
  casper.thenOpen('http://localhost:3000/./production/form_buttons.html', function () {
    phantomcss.screenshot('body', 'form_buttons');
  });

  // Test screenshot: form.html
  casper.thenOpen('http://localhost:3000/./production/form.html', function () {
    phantomcss.screenshot('body', 'form');
  });

  // Test screenshot: form_upload.html
  casper.thenOpen('http://localhost:3000/./production/form_upload.html', function () {
    phantomcss.screenshot('body', 'form_upload');
  });

  // Test screenshot: form_validation.html
  casper.thenOpen('http://localhost:3000/./production/form_validation.html', function () {
    phantomcss.screenshot('body', 'form_validation');
  });

  // Test screenshot: form_wizards.html
  casper.thenOpen('http://localhost:3000/./production/form_wizards.html', function () {
    phantomcss.screenshot('body', 'form_wizards');
  });

  // Test screenshot: general_elements.html
  casper.thenOpen('http://localhost:3000/./production/general_elements.html', function () {
    phantomcss.screenshot('body', 'general_elements');
  });

  // Test screenshot: glyphicons.html
  casper.thenOpen('http://localhost:3000/./production/glyphicons.html', function () {
    phantomcss.screenshot('body', 'glyphicons');
  });

  // Test screenshot: icons.html
  casper.thenOpen('http://localhost:3000/./production/icons.html', function () {
    phantomcss.screenshot('body', 'icons');
  });

  // Test screenshot: inbox.html
  casper.thenOpen('http://localhost:3000/./production/inbox.html', function () {
    phantomcss.screenshot('body', 'inbox');
  });

  // Test screenshot: invoice.html
  casper.thenOpen('http://localhost:3000/./production/invoice.html', function () {
    phantomcss.screenshot('body', 'invoice');
  });

  // Test screenshot: map.html
  casper.thenOpen('http://localhost:3000/./production/map.html', function () {
    phantomcss.screenshot('body', 'map');
  });

  // Test screenshot: media_gallery.html
  casper.thenOpen('http://localhost:3000/./production/media_gallery.html', function () {
    phantomcss.screenshot('body', 'media_gallery');
  });

  // Test screenshot: morisjs.html
  casper.thenOpen('http://localhost:3000/./production/morisjs.html', function () {
    phantomcss.screenshot('body', 'morisjs');
  });

  // Test screenshot: other_charts.html
  casper.thenOpen('http://localhost:3000/./production/other_charts.html', function () {
    phantomcss.screenshot('body', 'other_charts');
  });

  // Test screenshot: page_403.html
  casper.thenOpen('http://localhost:3000/./production/page_403.html', function () {
    phantomcss.screenshot('body', 'page_403');
  });

  // Test screenshot: page_404.html
  casper.thenOpen('http://localhost:3000/./production/page_404.html', function () {
    phantomcss.screenshot('body', 'page_404');
  });

  // Test screenshot: page_500.html
  casper.thenOpen('http://localhost:3000/./production/page_500.html', function () {
    phantomcss.screenshot('body', 'page_500');
  });

  // Test screenshot: plain_page.html
  casper.thenOpen('http://localhost:3000/./production/plain_page.html', function () {
    phantomcss.screenshot('body', 'plain_page');
  });

  // Test screenshot: pricing_tables.html
  casper.thenOpen('http://localhost:3000/./production/pricing_tables.html', function () {
    phantomcss.screenshot('body', 'pricing_tables');
  });

  // Test screenshot: profile.html
  casper.thenOpen('http://localhost:3000/./production/profile.html', function () {
    phantomcss.screenshot('body', 'profile');
  });

  // Test screenshot: project_detail.html
  casper.thenOpen('http://localhost:3000/./production/project_detail.html', function () {
    phantomcss.screenshot('body', 'project_detail');
  });

  // Test screenshot: projects.html
  casper.thenOpen('http://localhost:3000/./production/projects.html', function () {
    phantomcss.screenshot('body', 'projects');
  });

  // Test screenshot: projects.html
  casper.thenOpen('http://localhost:3000/./production/projects.html', function () {
    phantomcss.screenshot('body', 'projects');
  });

  // Test screenshot: tables.html
  casper.thenOpen('http://localhost:3000/./production/tables.html', function () {
    phantomcss.screenshot('body', 'tables');
  });

  // Test screenshot: tables_dynamic.html
  casper.thenOpen('http://localhost:3000/./production/tables_dynamic.html', function () {
    phantomcss.screenshot('body', 'tables_dynamic');
  });

  // Test screenshot: typography.html
  casper.thenOpen('http://localhost:3000/./production/typography.html', function () {
    phantomcss.screenshot('body', 'typography');
  });

  // Test screenshot: widgets.html
  casper.thenOpen('http://localhost:3000/./production/widgets.html', function () {
    phantomcss.screenshot('body', 'widgets');
  });

  // Test screenshot: widgets.html
  casper.thenOpen('http://localhost:3000/./production/widgets.html', function () {
    phantomcss.screenshot('body', 'widgets');
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

/**
 * Skipped pages:
 * production/xx.html
 * production/chartjs2.html
 * production/index2.html
 * production/index3.html
 * production/level2.html
 */

