var gulp = require('gulp');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var data = require('gulp-data');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var connect = require('gulp-connect');
var stylish = require('jshint-stylish');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('build-html', function() {
  gulp.src('./src/page/**/*.jade')
    .pipe(data(function(file) {
      return require('./config.json');
    }))
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./build/page'))
    .pipe(connect.reload());
});

gulp.task('build-css', function() {
  gulp.src('./src/static/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['> 1%', 'IE 7'],
      cascade: false
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./build/static'))
    .pipe(connect.reload());
});

gulp.task('build-js', function() {
  gulp.src('./src/static/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'))
    .pipe(gulp.dest('./build/static'))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(['./src/page/**/*.jade', './src/widget/**/*.jade'], ['build-html']);
  gulp.watch('./src/static/**/*.scss', ['build-css']);
  gulp.watch('./src/static/**/*.js', ['build-js']);
});

gulp.task('connect', function(done) {
  connect.server({
    root: 'build/page/index',
    livereload: true
  });
});

gulp.task('clean', function() {
  return gulp.src('./build', { read: false })
    .pipe(clean());
});

gulp.task('default', ['build-html', 'build-css', 'build-js', 'connect', 'watch']);
