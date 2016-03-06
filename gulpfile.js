var gulp = require('gulp'),
    rename = require("gulp-rename"),
    del = require('del'),
    js = require('gulp-uglify');

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

gulp.task('build', ['js']);

gulp.task('default', ['build']);



