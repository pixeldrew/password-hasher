var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    requireConfig = require('./build.json'),
    rjs = require('gulp-requirejs'),
    bump = require('gulp-bump'),
    semver = require('semver'),
    packageInfo = require('./package.json'),
    version = packageInfo.version,
    replace = require('gulp-replace'),
    paths = {
        sass: ['./css/**/*.scss']
    },
    configXmlVersionRe = /(widget id="net.pixelburn.passwordhasher" version=")(\d+.\d+.\d+)/g;

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

gulp.task('bump-json-patch', function(done) {
    gulp.src(['./package.json', './bower.json'])
        .pipe(bump())
        .pipe(gulp.dest('./'));
});
gulp.task('bump-xml-patch', function(done) {
    gulp.src(['config.xml'])
        .pipe(replace(configXmlVersionRe, '$1' + semver.inc(version, 'patch')))
        .pipe(gulp.dest('./'))
        .on('end', done);
});

gulp.task('bump-json-minor', function(done) {
    gulp.src(['./package.json', './bower.json'])
        .pipe(bump({type: 'minor'}))
        .pipe(gulp.dest('./'))
        .on('end', done);

});
gulp.task('bump-xml-minor', function(done) {
    gulp.src(['config.xml'])
        .pipe(replace(configXmlVersionRe, '$1' + semver.inc(version, 'minor')))
        .pipe(gulp.dest('./'))
        .on('end', done);
});

gulp.task('bump-json-major', function() {
    gulp.src(['./package.json', './bower.json'])
        .pipe(bump({type: 'major'}))
        .pipe(gulp.dest('./'));
});
gulp.task('bump-xml-major', function(done) {
    gulp.src(['config.xml'])
        .pipe(replace(configXmlVersionRe, '$1' + semver.inc(version, 'major')))
        .pipe(gulp.dest('./'))
        .on('end', done);
});

gulp.task('bump-patch', ['bump-json-patch', 'bump-xml-patch']);
gulp.task('bump-minor', ['bump-json-minor', 'bump-xml-minor']);
gulp.task('bump-major', ['bump-json-major', 'bump-xml-major']);

gulp.task('default', ['sass', 'js']);