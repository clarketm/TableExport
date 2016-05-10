var gulp = require('gulp'),
    rename = require("gulp-rename"),
    del = require('del'),
    css = require('gulp-clean-css');
    js = require('gulp-uglify');

gulp.task('css', ['clean'], function () {
    return gulp.src('./src/stable/css/tableexport.css')
        .pipe(gulp.dest('./dist/css/'))
        .pipe(css())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('js', ['clean'], function () {
    return gulp.src('./src/stable/js/tableexport.js')
        .pipe(gulp.dest('./dist/js/'))
        .pipe(js({output: {comments: /^!|@preserve|@license|@cc_on/i}}))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('clean', function () {
    return del(['dist/js']);
});

gulp.task('build', ['css', 'js']);

gulp.task('default', ['build']);



