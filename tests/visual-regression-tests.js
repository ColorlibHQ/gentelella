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

  // TEST: general_elements.html
  casper.thenOpen('http://localhost:3000/./production/general_elements.html', function() {
    // tests are below
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="tabs-1"]', 'general_elements-x_panel-tabs-1'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="tabs-2"]', 'general_elements-x_panel-tabs-2'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="vertical-tabs-1"]', 'general_elements-x_panel-vertical_tabs_1'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="vertical-tabs-2"]', 'general_elements-x_panel-vertical_tabs_2'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="collapsible-1"]', 'general_elements-x_panel-collapsible_1'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="collapsible-2"]', 'general_elements-x_panel-collapsible_2'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="tooltips-1"]', 'general_elements-x_panel-tooltips_1'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="tooltips-2"]', 'general_elements-x_panel-tooltips_2'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="daily-active-users-1"]', 'general_elements-x_panel-daily_active_user_1'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="daily-active-users-2"]', 'general_elements-x_panel-daily_active_user_2'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="daily-active-users-3"]', 'general_elements-x_panel-daily_active_user_3'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="dropdowns"]', 'general_elements-x_panel-dropdowns'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="modals"]', 'general_elements-x_panel-modals'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="notifications"]', 'general_elements-x_panel-notifications'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="popovers"]', 'general_elements-x_panel-popovers'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="progress-bar"]', 'general_elements-x_panel-progress_bar'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="simple-tasks"]', 'general_elements-x_panel-simple_tasks'); });

  // TEST: chartjs.html
  casper.thenOpen('http://localhost:3000/./production/chartjs.html', function() {
    // tests are below
    casper.wait(2000, function() {});
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="line-graph"]', 'chartjs-x_panel-line_graph'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="bar-graph"]', 'chartjs-x_panel-bar_graph'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="radar"]', 'chartjs-x_panel-radar'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="donut-graph"]', 'chartjs-x_panel-donut_graph'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="pie-graph-chart"]', 'chartjs-x_panel-pie_graph_chart'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="pie-area-graph"]', 'chartjs-x_panel-pie_area_graph'); });

  // TEST: chartjs2.html
  casper.thenOpen('http://localhost:3000/./production/chartjs2.html', function() {
    // tests are below
    casper.wait(2000, function() {});    
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="line-graph"]', 'chartjs2-x_panel-line_graph'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="bar-graph"]', 'chartjs2-x_panel-bar_graph'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="donut-graph"]', 'chartjs2-x_panel-donut_graph'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="radar"]', 'chartjs2-x_panel-radar'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="pie-area-chart"]', 'chartjs2-x_panel-pie_area_chart'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="pie-graph-chart"]', 'chartjs2-x_panel-pie_graph_chart'); });

  // TEST: echarts.html
  casper.thenOpen('http://localhost:3000/./production/echarts.html', function() {
    // tests are below
    casper.wait(2000, function() {});    
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="line-graph"]', 'echarts-x_panel-line_graph'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="bar-graph"]', 'echarts-x_panel-bar_graph'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="mini-pie"]', 'echarts-x_panel-mini_pie'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="pie-graph"]', 'echarts-x_panel-pie_graph'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="pie-graph"]', 'echarts-x_panel-pie_graph'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="pie-area"]', 'echarts-x_panel-pie_area'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="donut-graph"]', 'echarts-x_panel-donut_graph'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="scatter-graph"]', 'echarts-x_panel-scatter_graph'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="horizontal-bar"]', 'echarts-x_panel-horizontal_bar'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="world-map"]', 'echarts-x_panel-world_map'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="pyramid"]', 'echarts-x_panel-pyramid'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="sonar"]', 'echarts-x_panel-sonar'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="guage"]', 'echarts-x_panel-guage'); });

  // TEST: morisjs.html
  casper.thenOpen('http://localhost:3000/./production/morisjs.html', function() {
    // tests are below
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="bar-chart"]', 'morisjs-x_panel-bar_chart'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="bar-chart-group-1"]', 'morisjs-x_panel-bar_chart_group_1'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="bar-chart-group-2"]', 'morisjs-x_panel-bar_chart_group_2'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="pie-chart"]', 'morisjs-x_panel-pie_chart'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="graph-area"]', 'morisjs-x_panel-graph_area'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="line-graph"]', 'morisjs-x_panel-line_graph'); });

  // TEST: other_charts.html
  casper.thenOpen('http://localhost:3000/./production/other_charts.html', function() {
    // tests are below
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="other-graph-types"]', 'other_charts-x_panel-other_graph_types'); });

  // TEST: e_commerce.html
  casper.thenOpen('http://localhost:3000/./production/e_commerce.html', function() {
    // tests are below
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="e-commerce-page-design"]', 'e_commerce-x_panel-e_commerce_page_design'); });

  // TEST: glyphicons.html
  casper.thenOpen('http://localhost:3000/./production/glyphicons.html', function() {
    // tests are below
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="glyphicons"]', 'glyphicons-x_panel-glyphicons'); });

  // TEST: icons.html
  casper.thenOpen('http://localhost:3000/./production/icons.html', function() {
    // tests are below
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="font-awesome-icons"]', 'icons-x_panel-font_awesome_icons'); });

  // TEST: inbox.html
  casper.thenOpen('http://localhost:3000/./production/inbox.html', function() {
    // tests are below
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="inbox-design"]', 'inbox-x_panel-inbox_design'); });

  // TEST: invoice.html
  casper.thenOpen('http://localhost:3000/./production/invoice.html', function() {
    // tests are below
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="invoice-design"]', 'invoice-x_panel-invoice_design'); });

  // TEST: media_gallery.html
  casper.thenOpen('http://localhost:3000/./production/media_gallery.html', function() {
    // tests are below
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="media-gallery"]', 'media_gallery-x_panel-media_gallery'); });

  // TEST: page_403.html
  casper.thenOpen('http://localhost:3000/./production/page_403.html', function() {
    phantomcss.screenshot('body', 'page_403');
  });

  // TEST: page_404.html
  casper.thenOpen('http://localhost:3000/./production/page_404.html', function() {
    phantomcss.screenshot('body', 'page_404');
  });

  // TEST: page_500.html
  casper.thenOpen('http://localhost:3000/./production/page_500.html', function() {
    phantomcss.screenshot('body', 'page_500');
  });

  // TEST: plain_page.html
  casper.thenOpen('http://localhost:3000/./production/plain_page.html', function() {
    //
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="plain-page"]', 'plain_page-x_panel-plain_page'); });

  // TEST: pricing_tables.html
  casper.thenOpen('http://localhost:3000/./production/pricing_tables.html', function() {
    //
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="pricing-tables"]', 'pricing_tables-x_panel-pricing_tables'); });

  // TEST: profile.html
  casper.thenOpen('http://localhost:3000/./production/profile.html', function() {
    //
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="user-report"]', 'profile-x_panel-user_report'); });

  // TEST: projects.html
  casper.thenOpen('http://localhost:3000/./production/projects.html', function() {
    //
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="projects"]', 'projects-x_panel-projects'); });

  // TEST: project_detail.html
  casper.thenOpen('http://localhost:3000/./production/project_detail.html', function() {
    //
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="new-partner"]', 'project_detail-x_panel-new_partner'); });

  // TEST: tables.html
  casper.thenOpen('http://localhost:3000/./production/tables.html', function() {
    //
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="basic-tables"]', 'tables-x_panel-basic_tables'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="stripped-table"]', 'tables-x_panel-stripped_table'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="hover-rows"]', 'tables-x_panel-hover_rows'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="bordered-table"]', 'tables-x_panel-bordered_table'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="table-design"]', 'tables-x_panel-table_design'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="table-design"]', 'tables-x_panel-table_design'); });

  // TEST: tables_dynamic.html
  casper.thenOpen('http://localhost:3000/./production/tables_dynamic.html', function() {
    //
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="default-example"]', 'tables_dynamic-x_panel-default_example'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="plus-table-design"]', 'tables_dynamic-x_panel-plus_table_design'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="button-example"]', 'tables_dynamic-x_panel-button_example'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="fixed-header-example"]', 'tables_dynamic-x_panel-fixed_header_example'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="keytable-example"]', 'tables_dynamic-x_panel-keytable_example'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="responsive-example"]', 'tables_dynamic-x_panel-responsive_example'); });

  // TEST: typography.html
  casper.thenOpen('http://localhost:3000/./production/typography.html', function() {
    //
  })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="typography"]', 'typography-x_panel-typography'); });

  // TEST: widgets.html
  casper.thenOpen('http://localhost:3000/./production/widgets.html', function() {
    //
  })
  .then(function() { phantomcss.screenshot('[data-test="row-1"]', 'widgets-row_1'); })
  .then(function() { phantomcss.screenshot('[data-test="row-2"]', 'widgets-row_2'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="tally-design-1"]', 'widgets-x_panel-tally_design_1'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="tally-design-2"]', 'widgets-x_panel-tally_design_2'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="tally-design-3"]', 'widgets-x_panel-tally_design_3'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="tally-design-4"]', 'widgets-x_panel-tally_design_4'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="tally-design-5"]', 'widgets-x_panel-tally_design_5'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="sales-close"]', 'widgets-x_panel-sales_close'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="user-mail"]', 'widgets-x_panel-user_mail'); })
  .then(function() { phantomcss.screenshot('.x_panel[data-test="panel-1"]', 'widgets-x_panel-panel_1'); });


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
production/level2.html
production/map.html
production/fixed_footer.html
production/fixed_sidebar.html
production/xx.html
*/
