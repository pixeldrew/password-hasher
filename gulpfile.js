var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var requireConfig = require('./build.json');
var packageInfo = require('./package.json');
var rjs = require('gulp-requirejs');

var paths = {
  sass: ['./css/**/*.scss']
};

gulp.task('sass', function(done) {
  gulp.src('./css/phasher.scss')
    .pipe(sass())
    .pipe(gulp.dest('./css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./css/'))
    .on('end', done);
});

gulp.task('build', function() {
    rjs(requireConfig).pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('default', ['sass', 'build']);