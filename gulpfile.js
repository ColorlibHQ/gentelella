const { src, series, parallel, watch, dest } = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS = require('gulp-clean-css'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  plumber = require('gulp-plumber'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  browserSync = require('browser-sync').create()

const DEST = 'build/'

const buildJs = done => {
  src(['src/js/helpers/*.js', 'src/js/*.js'], { sourcemaps: true })
    .pipe(
      plumber({
        errorHandler: notify.onError('<%= error.message %>')
      })
    )
    .pipe(concat('custom.js'))
    .pipe(dest(DEST + '/js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(DEST + '/js', { sourcemaps: './maps' }))
    .pipe(browserSync.stream())
  done()
}
buildJs.displayName = 'Build JS'

const buildCss = done => {
  src('src/scss/*.scss', { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(
      plumber({
        errorHandler: notify.onError('<%= error.message %>')
      })
    )
    .pipe(
      sass({
        outputStyle: 'expanded'
      })
    )
    .pipe(concat('custom.css'))
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions']
      })
    )
    .pipe(dest(DEST + '/css'))
    .pipe(cleanCSS())
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest(DEST + '/css'))
    .pipe(browserSync.stream())
  done()
}
buildCss.displayName = 'Build CSS'

const startBrowserSync = done => {
  browserSync.init({
    port: 8080,
    server: {
      baseDir: './'
    },
    startPath: './production/index.html',
    reloadOnRestart: true
  })
  done()
}
startBrowserSync.displayName = 'Start Browser Sync'

const watchAll = done => {
  const browserReload = () => {
    browserSync.reload()
    done()
  }
  watch('src/scss/*.scss').on('change', series(buildCss, browserReload))
  watch('src/js/*.js').on('change', series(buildJs, browserReload))
  watch('production/*.html').on('change', series(browserReload))
}
watchAll.displayName = 'Watch All'

// Default Task
exports.default = series(
  parallel(buildJs, buildCss),
  startBrowserSync,
  watchAll
)
