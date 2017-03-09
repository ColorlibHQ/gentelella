var phantomcss = require('phantomcss');

// http://phantomjs.org/api/fs/method/list.html
var fs = require('fs');
var _ = require('lodash');

casper.test.begin('Gentelella visual tests', function (test) {

    phantomcss.init({
        rebase: casper.cli.get("rebase"),
        // SlimerJS needs explicit knowledge of this Casper, and lots of absolute paths
        casper: casper,
        libraryRoot: '',
        screenshotRoot: './test/screenshots/desktop',
        failedComparisonsRoot: './test/screenshots/desktop/failures',
        addLabelToFailedImage: false
    });

    // casper.on('remote.message', function (msg) {
    //     this.echo(msg);
    // });
    //
    // casper.on('error', function (err) {
    //     this.die("PhantomJS has errored: " + err);
    // });
    //
    // casper.on('resource.error', function (err) {
    //     casper.log('Resource load error: ' + err, 'warning');
    // });

    /*
     The test scenario
     */
    casper.start('http://localhost:8000/production/');
    casper.viewport(1920, 1080);

    var pages = fs.list('./production');
    pages = _.filter(pages, function (p) {
        return _.includes(p, 'html');
    });

    pages.forEach(function (page) {
        casper.thenOpen('http://localhost:8000/production/' + page, function () {
            console.log('testing page: ' + page);
            casper.wait(1000, function () {
                phantomcss.screenshot('body', page.replace('.html', ''));
            });
        });
    });

    casper.thenOpen('http://localhost:8000/production/', function () {
        casper.click('#menu_toggle');
        casper.wait(1000, function () {
            phantomcss.screenshot('body', 'index-small_menu');
        });
    });

    casper.then(function () {
        phantomcss.compareAll();
    });

    casper.run(function () {
        phantomcss.getExitStatus(); // pass or fail?
        casper.test.done();
    });
});