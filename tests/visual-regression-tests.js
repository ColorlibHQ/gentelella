var fs = require('fs');
var phantomcss = require('phantomcss');

function _onPass(test) {
  // console.log('\n');
  var name = 'Should look the same ' + test.filename;
  casper.test.pass(name, { name: name });
}

function _onFail(test) {
  // console.log('\n');
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

  // TEST login.html login_form.
  casper.thenOpen('http://localhost:3000/./production/login.html', function () {
    phantomcss.screenshot('.login_form', 'login_form');
  });

  // TEST login.html registration_form.
  casper.then(function () {
    casper.click('.to_register');

    // wait for modal to fade-in
    casper.wait(1200, function done() {
      phantomcss.screenshot('.registration_form', 'registration_form');
    });
  });

  // TEST index.html.
  casper.thenOpen('http://localhost:3000/./production/index.html', function () {
    // tests are below
  })
  .then(function() { phantomcss.screenshot('.left_col', 'index-left_col'); })
  .then(function() { phantomcss.screenshot('.nav_menu', 'index-nav_menu'); })
  .then(function() { phantomcss.screenshot('.row.tile_count', 'index-tile_count'); })
  .then(function() { phantomcss.screenshot('.dashboard_graph', 'index-dashboard_graph'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="app-versions"]', 'index-x_panel-app_versions'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="device-usage"]', 'index-x_panel-device_usage'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="recent-activities"]', 'index-x_panel-recent_activities'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="visitors-location"]', 'index-x_panel-visitors_location'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="todo-list"]', 'index-x_panel-todo_list'); })
  .then(function() { phantomcss.screenshot('footer', 'index-footer'); })
  .then(function() {
    casper.wait(300, function done() {
      phantomcss.screenshot('.x_panel[data-test="quick-settings"]', 'index-x_panel-quick_settings');
    });
  })
  .then(function() {
    // The screenshot always changes
    // phantomcss.screenshot('.x_panel[data-test="daily-active-users"]', 'index-x_panel-daily_active_users');
  });

  // TEST index.html user-profile dropdown.
  casper.then(function () {
    casper.click(".user-profile");

    // wait for modal to fade-in
    casper.waitForSelector('li.open .user-profile.dropdown-toggle',
      function success() {
        phantomcss.screenshot('li.open .dropdown-menu', 'index-user_profile');
      },
      function timeout() {
        casper.test.fail('Should see user profile dropdown.');
      }
    );
  });

  // TEST: index2.html
  casper.thenOpen('http://localhost:3000/./production/index2.html', function() {
    // tests are below
  })
  .then(function() { phantomcss.screenshot('.top_tiles', 'index2-top_tiles'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="top-profiles-1"]', 'index2-x_panel-top_profiles_1'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="top-profiles-2"]', 'index2-x_panel-top_profiles_2'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="top-profiles-3"]', 'index2-x_panel-top_profiles_3'); })
  .then(function() {
    casper.wait(3000, function() {
      phantomcss.screenshot('.x_panel[data-test="weekly-summary"]', 'index2-x_panel-weekly_summary');
    })
  })
  .then(function() {
    // the screenshots always changes with random data.
    // phantomcss.screenshot('.x_panel[data-test="transaction-summary"]', 'index2-x_panel-transaction_summary');
  });

  // TEST: index3.html
  casper.thenOpen('http://localhost:3000/./production/index3.html', function() {
    // tests are below
  })
  .then(function() { phantomcss.screenshot('.top_tiles', 'index3-top_tiles'); })
  .then(function() { phantomcss.screenshot('.dashboard_graph', 'index3-dashboard_graph'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="app-devices"]', 'index3-x_panel-app_devices'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="daily-users"]', 'index3-x_panel-daily_users'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="profile-settings"]', 'index3-x_panel-profile_settings'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="user-uptake"]', 'index3-x_panel-user_uptake'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="incomes"]', 'index3-x_panel-incomes'); })
  .then(function() {
    // the screenshots always changes
    // phantomcss.screenshot('.x_panel[data-test="today-weather"]', 'index3-x_panel-today_weather');
  });

  // TEST: calendar.html
  casper.thenOpen('http://localhost:3000/./production/calendar.html', function() {
    phantomcss.screenshot('.right_col', 'calendar-right_col');
  });

  // TEST: contacts.html
  casper.thenOpen('http://localhost:3000/./production/contacts.html', function() {
    // tests are below
  })
  .then(function() { phantomcss.screenshot('.page-title', 'contacts-page_title'); })
  .then(function() { phantomcss.screenshot('.x_panel', 'contacts-x_panel'); });


  // TEST: form.html
  casper.thenOpen('http://localhost:3000/./production/form.html', function() {
    // tests are below
  })
  .then(function() { phantomcss.screenshot('.page-title', 'form-page_title'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="form-design-1"]', 'form-x_panel-form_design_1'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="form-design-2"]', 'form-x_panel-form_design_2'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="form-design-3"]', 'form-x_panel-form_design_3'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="star-rating"]', 'form-x_panel-star_rating'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="registration-form"]', 'form-x_panel-registration_form'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="form-basic-elements"]', 'form-x_panel-form_basic_elements'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="form-buttons"]', 'form-x_panel-form_buttons'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="text-areas"]', 'form-x_panel-text_areas'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="form-input-grid"]', 'form-x_panel-form_input_grid'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="form-input-grid"]', 'form-x_panel-form_input_grid'); });

  // TEST: form_advanced.html
  casper.thenOpen('http://localhost:3000/./production/form_advanced.html', function() {
    // tests are below
  })
  .then(function() { phantomcss.screenshot('.page-title', 'form_advanced-page_title'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="input-mask"]', 'form_advanced-x_panel-input_mask'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="color-picker"]', 'form_advanced-x_panel-color_picker'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="input-knob"]', 'form_advanced-x_panel-input_knob'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="date-pickers"]', 'form_advanced-x_panel-date_pickers'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="grid-slider"]', 'form_advanced-x_panel-grid_slider'); })
  .then(function() { phantomcss.screenshot('.container.cropper', 'form_advanced-x_panel-image_cropper'); });

  // TEST: form_buttons.html
  casper.thenOpen('http://localhost:3000/./production/form_buttons.html', function() {
    // tests are below
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="default-buttons"]', 'form_buttons-x_panel-default_buttons'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="rounded-buttons"]', 'form_buttons-x_panel-rounded_buttons'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="button-dropdown"]', 'form_buttons-x_panel-button_dropdown'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="split-button-dropdown"]', 'form_buttons-x_panel-split_button_dropdown'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="button-app-design"]', 'form_buttons-x_panel-button_app_design'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="button-sizes"]', 'form_buttons-x_panel-button_sizes'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="button-groups"]', 'form_buttons-x_panel-button_groups'); });

  // TEST: form_upload.html
  casper.thenOpen('http://localhost:3000/./production/form_upload.html', function() {
    // tests are below
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="dropzone"]', 'form_upload-x_panel-dropzone'); });

  // TEST: form_validation.html
  casper.thenOpen('http://localhost:3000/./production/form_validation.html', function() {
    // tests are below
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="form-validation"]', 'form_validation-x_panel-form_validation'); });

  // TEST: form_wizards.html
  casper.thenOpen('http://localhost:3000/./production/form_wizards.html', function() {
    // tests are below
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="form-wizards"]', 'form_wizards-x_panel-form_wizards'); });

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


/*
production/chartjs2.html
production/chartjs.html
production/echarts.html
production/e_commerce.html
production/fixed_footer.html
production/fixed_sidebar.html
production/general_elements.html
production/glyphicons.html
production/icons.html
production/inbox.html
production/invoice.html
production/level2.html
production/map.html
production/media_gallery.html
production/morisjs.html
production/other_charts.html
production/page_403.html
production/page_404.html
production/page_500.html
production/plain_page.html
production/pricing_tables.html
production/profile.html
production/project_detail.html
production/projects.html
production/tables_dynamic.html
production/tables.html
production/typography.html
production/widgets.html
production/xx.html
*/
