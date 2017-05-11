var gulp = require('gulp'),
    replace = require('gulp-replace'),
    bump = require("gulp-bump"),
    rename = require("gulp-rename"),
    del = require('del'),
    css = require('gulp-clean-css');
    js = require('gulp-uglify');

gulp.task('copy:img', ['clean:img'], function () {
    return gulp.src(['./src/stable/img/**'])
        .pipe(gulp.dest('./dist/img'))
});

gulp.task('copy:dts', ['clean:dts'], function () {
    return gulp.src(['./src/stable/tableexport.d.ts'])
        .pipe(gulp.dest('./dist'))
});

/*gulp.task('copy:index', ['clean:index'], function () {
    return gulp.src(['./src/stable/index.js'])
        .pipe(gulp.dest('./dist'))
});*/

gulp.task('css', ['clean:css'], function () {
    return gulp.src('./src/stable/tableexport.css')
        .pipe(gulp.dest('./dist'))
        .pipe(css())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist'))
        //.pipe(gulp.dest('./src/stable/css/'))
        ;
});

gulp.task('js', ['clean:js'], function () {
    return gulp.src('./src/stable/tableexport.js')
        .pipe(gulp.dest('./dist'))
        .pipe(js({output: {comments: /^!|@preserve|@license|@cc_on/i}}))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist'))
        //.pipe(gulp.dest('./src/stable/js/'))
        ;
});

gulp.task('bump', ['bump-js', 'bump-css'], function(){
    return gulp.src(['./bower.json', './package.json'])
        .pipe(bump())
        .pipe(gulp.dest('./'));
});

gulp.task('bump-js', function () {
    return gulp.src(['src/stable/tableexport.js'])
        .pipe(replace(/(v\d+\.\d+\.)(\d+)/g, function (matches, match1, match2) {
            return match1 + (Number(match2)+1);
        }))
        .pipe(replace(/(version: ["']\d+\.\d+\.)(\d+)/g, function (matches, match1, match2) {
            return match1 + (Number(match2)+1);
        }))
        .pipe(gulp.dest('src/stable'))
        .on('end', function () {
            gulp.start('js');
        });
});

gulp.task('bump-css', function () {
    gulp.src(['src/stable/css/tableexport.css'])
        .pipe(replace(/(v\d+\.\d+\.)(\d+)/g, function (matches, match1, match2) {
            return match1 + (Number(match2) + 1);
        }))
        .pipe(gulp.dest('src/stable'))
        .on('end', function () {
            gulp.start('css');
        });
});

gulp.task('clean:img', function () {
    return del(['dist/img']);
});

gulp.task('clean:dts', function () {
    return del(['dist/tableexport.d.ts']);
});

/*gulp.task('clean:index', function () {
    return del(['dist/index.js']);
});*/

gulp.task('clean:css', function () {
    return del(['dist/*.css']);
});

gulp.task('clean:js', function () {
    return del(['dist/*.js']);
});

gulp.task('copy', ['copy:img', 'copy:dts']);

gulp.task('build', ['css', 'js', 'copy']);

gulp.task('default', ['build']);



