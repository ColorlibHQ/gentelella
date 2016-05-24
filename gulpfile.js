var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass');

var DEST = 'build/';

gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
      .pipe(concat('custom.js'))
      .pipe(gulp.dest(DEST+'/js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(DEST+'/js'));
});

gulp.task('sass', function() {
    return sass('src/scss/*.scss')
        .pipe(concat('custom.css'))
        .pipe(gulp.dest(DEST+'/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(DEST+'/css'));
});

gulp.task('watch', function() {
   // Watch .js files
  gulp.watch('src/js/*.js', ['scripts']);
   // Watch .scss files
  gulp.watch('src/scss/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['watch']);