var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create();

var DEST = 'build/';

gulp.task('fonts', function() {
    // Copy Font Awesome fonts to build directory
    return gulp.src('node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('build/fonts/'));
});

gulp.task('vendors', gulp.series('fonts', function() {
    // Copy core essential dependencies only
    
    // Copy jQuery
    gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('vendors/jquery/dist/'));
    
    // Copy Bootstrap CSS and JS
    gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest('vendors/bootstrap/dist/css/'));
    gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
        .pipe(gulp.dest('vendors/bootstrap/dist/js/'));
    
    // Copy Font Awesome
    gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
        .pipe(gulp.dest('vendors/font-awesome/css/'));
    gulp.src('node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('vendors/font-awesome/fonts/'));
    
    // Copy Chart.js
    gulp.src('node_modules/chart.js/dist/Chart.min.js')
        .pipe(gulp.dest('vendors/Chart.js/dist/'));
    
    // Copy Moment.js
    gulp.src('node_modules/moment/min/moment.min.js')
        .pipe(gulp.dest('vendors/moment/min/'));
    
    // Copy NProgress
    gulp.src('node_modules/nprogress/nprogress.css')
        .pipe(gulp.dest('vendors/nprogress/'));
    gulp.src('node_modules/nprogress/nprogress.js')
        .pipe(gulp.dest('vendors/nprogress/'));
    
    // Copy FastClick
    gulp.src('node_modules/fastclick/lib/fastclick.js')
        .pipe(gulp.dest('vendors/fastclick/lib/'));
    
    // Copy iCheck
    gulp.src('node_modules/icheck/skins/flat/green.css')
        .pipe(gulp.dest('vendors/iCheck/skins/flat/'));
    gulp.src('node_modules/icheck/icheck.min.js')
        .pipe(gulp.dest('vendors/iCheck/'));
    
    // Copy Bootstrap Progressbar
    gulp.src('node_modules/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css')
        .pipe(gulp.dest('vendors/bootstrap-progressbar/css/'));
    gulp.src('node_modules/bootstrap-progressbar/bootstrap-progressbar.min.js')
        .pipe(gulp.dest('vendors/bootstrap-progressbar/'));
    
    // Copy Gauge.js
    gulp.src('node_modules/gauge.js/dist/gauge.min.js')
        .pipe(gulp.dest('vendors/gauge.js/dist/'));
    
    // Copy Skycons
    gulp.src('node_modules/skycons/skycons.js')
        .pipe(gulp.dest('vendors/skycons/'));
    
    // Copy Flot
    gulp.src('node_modules/flot/dist/es5/jquery.flot.js')
        .pipe(gulp.dest('vendors/Flot/'));
    
    // Copy DateRangePicker
    gulp.src('node_modules/daterangepicker/daterangepicker.css')
        .pipe(gulp.dest('vendors/bootstrap-daterangepicker/'));
    return gulp.src('node_modules/daterangepicker/daterangepicker.js')
        .pipe(gulp.dest('vendors/bootstrap-daterangepicker/'));
}));

gulp.task('scripts', function() {
    return gulp.src([
        // Include vendor JavaScript first
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
        'node_modules/fastclick/lib/fastclick.js',
        'node_modules/nprogress/nprogress.js',
        'node_modules/chart.js/dist/Chart.min.js',
        'node_modules/bootstrap-progressbar/bootstrap-progressbar.min.js',
        'node_modules/icheck/icheck.min.js',
        'node_modules/moment/min/moment.min.js',
        'node_modules/daterangepicker/daterangepicker.js',
        'node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js',
        // Custom scripts
        'src/js/helpers/smartresize.js',
        'src/js/sidebar.js',
        'src/js/init.js'
    ])
    .pipe(concat('custom.js'))
    .pipe(gulp.dest(DEST+'/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(DEST+'/js'))
    .pipe(browserSync.stream());
});

// Compile CSS from both vendor dependencies and custom SCSS
var compileSASS = function (filename, options) {
  return gulp.src([
          // Include vendor CSS first
          'node_modules/bootstrap/dist/css/bootstrap.min.css',
          'node_modules/font-awesome/css/font-awesome.min.css',
          'node_modules/nprogress/nprogress.css',
          'node_modules/icheck/skins/flat/green.css',
          'node_modules/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css',
          'node_modules/daterangepicker/daterangepicker.css',
          'node_modules/switchery/switchery.css',
          'node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css',
          // Then include custom SCSS
          'src/scss/*.scss'
        ])
        .pipe(sass(options).on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions', '> 5%'))
        .pipe(concat(filename))
        .pipe(gulp.dest(DEST+'/css'))
        .pipe(browserSync.stream());
};

gulp.task('sass', function() {
    return compileSASS('custom.css', {});
});

gulp.task('sass-minify', function() {
    return compileSASS('custom.min.css', {outputStyle: 'compressed'});
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: './production/index.html'
    });
});

gulp.task('watch', function() {
  // Watch .html files
  gulp.watch('production/*.html', browserSync.reload);
  // Watch .js files
  gulp.watch('src/js/*.js', ['scripts']);
  // Watch .scss files
  gulp.watch('src/scss/*.scss', ['sass', 'sass-minify']);
});

// Build Task
gulp.task('build', gulp.series('vendors', 'sass', 'sass-minify', 'scripts'));

// Default Task
gulp.task('default', gulp.series('browser-sync', 'watch'));