'use strict';
var gulp = require('gulp');
var concat = require('gulp-concat');
// var connect = require('gulp-connect');
// var jade = require('gulp-jade');
var minimist = require('minimist');
var $ = require('gulp-load-plugins')();

var pkg = require("./package.json");

//默认development环境
var knowOptions = {
  string: 'env',
  default: {
    env: process.env.NODE_ENV || 'development'
  }
};

var options = minimist(process.argv.slice(2), knowOptions);


var banner = 
'/** \n\\' +
'* '+ pkg.name +' V' + pkg.version + ' \n\\' +
'* By '+ pkg.author +'\n\\' +
'*/\n';

//jade2html
gulp.task('jade', function (done) {
  gulp.src(['./src/jade/**/*.jade', '!./src/jade/**/layout.jade'])
    .pipe($.jade())
    .on('error', function (e) {
      console.log('jade2html error-->', e);
    })
    .pipe(gulp.dest('./dist'))
    .on('end', done)
});

//jade2html
gulp.task('scss2css', function (done) {
  gulp.src(['./src/scss/**/*.scss', '!./src/scss/**/setting.scss'])
    .pipe($.sass())
    // .on('error', $.sass.logError)
    .pipe(gulp.dest('./dist/css'))
    .on('end', done)
});

// 静态文件搬进dist目录
gulp.task('data2dist', function (done) {
  gulp.src(['./src/images/**/*.*']).pipe(gulp.dest('./dist/images/'));
  gulp.src(['./src/font/**/*.*']).pipe(gulp.dest('./dist/font/'));
  gulp.src(['./src/css/**/*.css']).pipe(gulp.dest('./dist/css/'));
  gulp.src(['./src/js/**/*.js']).pipe(gulp.dest('./dist/js/'));
});

// gulp.task('')

gulp.task('watch', function () {
  // gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/scss/**/*.scss', ['scss2css']);
  gulp.watch('src/images/**/*.*', ['data2dist']);
  gulp.watch('src/jade/**/*.jade', ['jade']);
  // gulp.watch('demos/css/*.css', ['copy']);
});

gulp.task('build', ['jade', 'data2dist']);

gulp.task('server', function () {
  $.connect.server({
    debug: true,
    host: 'localhost',
    port: 8001,
    livereload: true,
    root: ['./dist']
  });
  
});

gulp.task("default", ['watch', 'server'], () => {
  console.log('*************', options.env)
});
// gulp.task("build", ['uglify', 'cssmin', 'copy', 'ejs']);
