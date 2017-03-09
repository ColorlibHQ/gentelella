var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create();

var DEST = 'build/';

gulp.task('scripts', function () {
    return gulp.src([
        'src/js/helpers/*.js',
        'src/js/*.js'])
        .pipe(concat('custom.js'))
        .pipe(gulp.dest(DEST + '/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(DEST + '/js'))
        .pipe(browserSync.stream());
});

gulp.task('sass', function () {
    return gulp.src('src/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions', '> 5%'))
        .pipe(concat('custom.css'))
        .pipe(gulp.dest(DEST + '/css'))
        .pipe(browserSync.stream());
});

gulp.task('build-sass', function () {
    return gulp.src('src/scss/main.scss').pipe(sass());
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: './production/index.html'
    });
});

gulp.task('watch', function () {
    // Watch .html files
    gulp.watch('production/*.html', browserSync.reload);
    // Watch .js files
    gulp.watch('src/js/*.js', ['scripts']);
    // Watch .scss files
    gulp.watch('src/scss/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['browser-sync', 'watch']);
