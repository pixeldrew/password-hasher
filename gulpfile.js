var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var requireConfig = require('./build.json');
var rjs = require('gulp-requirejs');
var bump = require('gulp-bump');
var semver = require('semver');
var packageInfo = require('./package.json');
var version = packageInfo.version;

var replace = require('gulp-replace');

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

gulp.task('bump-json-patch', function(done){
    gulp.src(['./package.json', './bower.json'])
        .pipe(bump())
        .pipe(gulp.dest('./'));
});
gulp.task('bump-xml-patch', function(done) {
    gulp.src(['config.xml'])
        .pipe(replace(/(widget id="net.pixelburn.passwordhasher" version=")(\d+.\d+.\d+)/g, '$1' + semver.inc(version, 'patch')))
        .pipe(gulp.dest('./'))
        .on('end', done);
});
gulp.task('bump-patch', ['bump-json-patch', 'bump-xml-patch']);

gulp.task('bump-json-minor', function(done){
    gulp.src(['./package.json', './bower.json'])
        .pipe(bump({type:'minor'}))
        .pipe(gulp.dest('./'))
        .on('end', done);

});
gulp.task('bump-xml-minor', function(done) {
    gulp.src(['config.xml'])
        .pipe(replace(/(widget id="net.pixelburn.passwordhasher" version=")(\d+.\d+.\d+)/g, '$1' + semver.inc(version, 'minor')))
        .pipe(gulp.dest('./'))
        .on('end', done);
});
gulp.task('bump-minor', ['bump-json-minor', 'bump-xml-minor']);

gulp.task('bump-json-major', function(){
    gulp.src(['./package.json', './bower.json'])
        .pipe(bump({type:'major'}))
        .pipe(gulp.dest('./'));
});
gulp.task('bump-xml-major', function(done) {
    gulp.src(['config.xml'])
        .pipe(replace(/(widget id="net.pixelburn.passwordhasher" version=")(\d+.\d+.\d+)/g, '$1' + semver.inc(version, 'major')))
        .pipe(gulp.dest('./'))
        .on('end', done);
});
gulp.task('bump-major', ['bump-json-major', 'bump-xml-major']);



gulp.task('release-patch', ['sass', 'js', 'bump-patch']);
gulp.task('release-feature', ['sass', 'js', 'bump-minor']);
gulp.task('release-major', ['sass', 'js', 'bump-major']);

gulp.task('default', ['sass', 'js']);
