var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var filesExist = require('files-exist');
var maps = require('gulp-sourcemaps');
var gulpSequence = require('gulp-sequence');

var files = [
    './source/jquery.canvaswrapper.js',
    './source/jquery.colorhelpers.js',
    './source/jquery.flot.js',
    './source/jquery.flot.saturated.js',
    './source/jquery.flot.browser.js',
    './source/jquery.flot.drawSeries.js',
    './source/jquery.flot.errorbars.js',
    './source/jquery.flot.uiConstants.js',
    './source/jquery.flot.logaxis.js',
    './source/jquery.flot.symbol.js',
    './source/jquery.flot.flatdata.js',
    './source/jquery.flot.navigate.js',
    './source/jquery.flot.fillbetween.js',
    './source/jquery.flot.stack.js',
    './source/jquery.flot.touchNavigate.js',
    './source/jquery.flot.hover.js',
    './source/jquery.flot.touch.js',
    './source/jquery.flot.time.js',
    './source/jquery.flot.axislabels.js',
    './source/jquery.flot.selection.js',
    './source/jquery.flot.composeImages.js',
    './source/jquery.flot.legend.js'
];

gulp.task('build_flot_source', function() {
    return gulp.src(filesExist(files, { exceptionMessage: 'Missing file' }))
        .pipe(concat('jquery.flot.js'))
        .pipe(gulp.dest('dist/source'));
});

gulp.task('build_flot_minified', function() {
    return gulp.src(filesExist(files, { exceptionMessage: 'Missing file' }))
        .pipe(maps.init())
        .pipe(babel({
            "presets": [
                "@babel/preset-env"
            ]
        }))
        .pipe(concat('jquery.flot.js'))
        .pipe(uglify())
        .pipe(maps.write('./'))
        .pipe(gulp.dest('dist/es5'));
});

gulp.task('build', gulp.series('build_flot_source', 'build_flot_minified'));
