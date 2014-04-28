var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var requireConfig = require('./build.json');
var rjs = require('gulp-requirejs');
var bump = require('gulp-bump');

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

gulp.task('js', function(done) {
    rjs(requireConfig).pipe(gulp.dest('./')).on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('bump-minor', function(){
    gulp.src(['./package.json', './bower.json'])
        .pipe(bump({type:'minor'}))
        .pipe(gulp.dest('./'));
});

gulp.task('bump-major', function(){
    gulp.src(['./package.json', './bower.json'])
        .pipe(bump({type:'major'}))
        .pipe(gulp.dest('./'));
});

gulp.task('release-patch', ['sass', 'js', 'bump-minor']);
gulp.task('release-feature', ['sass', 'js', 'bump-major']);

gulp.task('default', ['sass', 'js']);