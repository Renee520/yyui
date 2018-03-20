var gulp = require('gulp');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var jade = require('gulp-jade');

//jade2html
gulp.task('jade', function (done) {
  gulp.src(['./src/jade/**/*.jade', '!./src/jade/**/layout.jade'])
    .pipe(jade())
    .on('error', function (e) {
      console.log('jade2html error-->', e);
    })
    .pipe(gulp.dest('./dist'))
    .on('end', done)
});

gulp.task('watch', function () {
  // gulp.watch('src/js/**/*.js', ['js']);
  // gulp.watch('src/less/**/*.less', ['less']);
  // gulp.watch('demos/*.html', ['ejs']);
  // gulp.watch('demos/css/*.css', ['copy']);
});

gulp.task('server', function () {
  connect.server({
    debug: true,
    host: 'localhost',
    port: 8000,
    livereload: true,
    root: ['./dist']
  });
});
gulp.task("default", ['watch', 'server']);
// gulp.task("build", ['uglify', 'cssmin', 'copy', 'ejs']);
