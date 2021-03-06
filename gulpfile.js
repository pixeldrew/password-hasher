var packageInfo = require('./package.json'),
    version = packageInfo.version,
    //dependo = require('dependo'),
    semver = require('semver'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    requireConfig = require('./build.json'),
    rjs = require('gulp-requirejs'),
    bump = require('gulp-bump'),
    replace = require('gulp-replace'),
    insert = require('gulp-insert'),
    sequence = require('run-sequence'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    codeVersion = 'var appVersion="' + version + '";',
    codeCopyRight = "/**\n" + packageInfo.copyright + "\n\n" + packageInfo.description + "\n */\n",
    paths = {
        sass: ['./css/**/*.scss']
    },
    configXmlVersionRe = /(widget id="net.pixelburn.passwordhasher" version=")(\d+.\d+.\d+)/g;

gulp.task('sass', function() {
    gulp.src('./css/phasher.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css/'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./css/'));
});

gulp.task('requirejs', function() {
    return rjs(requireConfig)
        .pipe(gulp.dest('./'));
});

//gulp.task('dependo', function() {
//    dependo.generateHtml()
//})

gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
});

gulp.task('bump-json-patch', function() {
    gulp.src(['./package.json', './bower.json'])
        .pipe(bump())
        .pipe(gulp.dest('./'));
});
gulp.task('bump-xml-patch', function() {
    gulp.src(['config.xml'])
        .pipe(replace(configXmlVersionRe, '$1' + semver.inc(version, 'patch')))
        .pipe(gulp.dest('./'));
});

gulp.task('bump-json-minor', function() {
    gulp.src(['./package.json', './bower.json'])
        .pipe(bump({type: 'minor'}))
        .pipe(gulp.dest('./'));

});
gulp.task('bump-xml-minor', function() {
    gulp.src(['config.xml'])
        .pipe(replace(configXmlVersionRe, '$1' + semver.inc(version, 'minor')))
        .pipe(gulp.dest('./'));
});

gulp.task('bump-json-major', function() {
    gulp.src(['./package.json', './bower.json'])
        .pipe(bump({type: 'major'}))
        .pipe(gulp.dest('./'));
});
gulp.task('bump-xml-major', function() {
    gulp.src(['config.xml'])
        .pipe(replace(configXmlVersionRe, '$1' + semver.inc(version, 'major')))
        .pipe(gulp.dest('./'));
});

gulp.task('bump-hotfix', ['bump-json-patch', 'bump-xml-patch']);
gulp.task('bump-release-minor', ['bump-json-minor', 'bump-xml-minor']);
gulp.task('bump-release-major', ['bump-json-major', 'bump-xml-major']);

gulp.task('build-clean', function() {
    return gulp.src('js/main.min.js', {read: false})
        .pipe(clean());
});

gulp.task('compress', function() {
    gulp.src('./js/main.min.js')
        .pipe(uglify())
        .pipe(insert.prepend(codeVersion))
        .pipe(insert.prepend(codeCopyRight))
        .pipe(gulp.dest('./js/'));
});

gulp.task('build', function(done) {
    sequence('build-clean','requirejs', 'compress', done);
});

gulp.task('default', ['build', 'sass']);
