var path = require('path');
var gulp = require('gulp');
var colors = require('colors');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var data = require('gulp-data');
var clean = require('gulp-clean');
var newer = require('gulp-newer');
var notify = require('gulp-notify');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var plumber = require('gulp-plumber');
var stylish = require('jshint-stylish');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var mainBowerFiles = require('main-bower-files');

gulp.task('build-html', function() {
  gulp.src('./src/pages/*.jade')
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    // .pipe(data(function(file) { // 阻止了jade报错
    //   return require('./config.json');
    // }))
    .pipe(jade({
      pretty: true
    }))
    .pipe(rename({
      dirname: ''
    }))
    .pipe(gulp.dest('./build/pages'))
    .pipe(notify('Build html: <%= file.relative %>'))
    .pipe(connect.reload());
});

gulp.task('build-css', function() {
  gulp.src('./src/sass/pages/*.scss')
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'expanded'
      })
      .on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['> 1%', 'IE 7'],
      cascade: false
    }))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest(function(file) {
      return './build/static/' + path.basename(file.path, '.css');
    }))
    .pipe(notify('Build css: <%= file.relative %>'))
    .pipe(connect.reload());
});

gulp.task('copy-js', function() {
  gulp.src('./src/scripts/pages/*.js')
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'))
    .pipe(gulp.dest(function(file) {
      return './build/static/' + path.basename(file.history[0], '.js');
    }))
    .pipe(notify('Copy pages js: <%= file.relative %>'))
    .pipe(connect.reload());

  gulp.src(['./src/scripts/**/*.js', '!./src/scripts/pages/*.js'])
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'))
    .pipe(gulp.dest('./build/static'))
    .pipe(notify('Copy components js: <%= file.relative %>'))
    .pipe(connect.reload());
});

gulp.task('copy-image', function() {
  var imgSrc = './src/images/**/*.*';
  var imgDest = './build/static';
  gulp.src(imgSrc)
    .pipe(newer(imgDest))
    .pipe(gulp.dest(imgDest))
    .pipe(notify('Copy images: <%= file.relative %>'))
    .pipe(connect.reload());;
})

gulp.task('watch', ['build'], function() {
  gulp.watch('src/pages/**/*.jade', ['build-html']);
  gulp.watch('src/sass/**/*.scss', ['build-css']);
  gulp.watch('src/scripts/**/*.js', ['copy-js']);
  gulp.watch('src/images/**/*.*', ['copy-image'])
});

gulp.task('connect', function(done) {
  connect.server({
    root: [
      'build/pages',
      'build'
    ],
    livereload: true
  });
});

gulp.task('bower', function() {
  return gulp.src(mainBowerFiles())
    .pipe(gulp.dest('./build/static/vendors'));
});

gulp.task('clean', function() {
  return gulp.src('./build', {
      read: false // 去掉读过程，加速
    })
    .pipe(clean());
});

gulp.task('help',function () {
  console.log('           gulp build          文件打包');
  console.log('           gulp server         文件监控打包');
  console.log('           gulp help           gulp参数说明');
  console.log('           gulp -p             生产环境（默认生产环境）');
  console.log('           gulp -d             开发环境');
  console.log('           gulp -m <module>    部分模块打包（默认全部打包）');
});

gulp.task('default',function () {
  gulp.start('help');
});

gulp.task('server', ['connect', 'watch'], function() {
  console.log('Serving...'.info);
});

gulp.task('build', ['build-html', 'build-css', 'copy-js', 'copy-image', 'bower'], function() {
  console.log('Build Success!'.green);
});
