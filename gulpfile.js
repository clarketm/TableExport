/**
 * @license Apache-2.0
 * @copyright Travis Clarke <travis.m.clarke@gmail.com> (https://www.travismclarke.com/)
 */

/**
 * @author fedeTibaldo <fedetibaldo@protonmail.com>
 * @summary Summary of changes
 * @description
 * Summary of changes:
 * - Rename entrypoint files to match the new module name.
 * - Flatten `src` directory by making the `/stable` branch the only one available.
 * - Remove `css` tasks and imports
 */

var gulp = require("gulp"),
  replace = require("gulp-replace"),
  bump = require("gulp-bump"),
  rename = require("gulp-rename"),
  del = require("del"),
  js = require("gulp-uglify");

gulp.task("js", ["clean"], function() {
  return gulp.src("./src/browser-xlsx.js")
    .pipe(gulp.dest("./dist/"))
    .pipe(js({ output: { comments: /^!|@preserve|@license|@cc_on/i } }))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest("./dist/"))
    .pipe(gulp.dest("./src/"));
});

gulp.task("bump-all", ["bump", "bump-js", "bump-typings", "bump-readme"]);

gulp.task("bump", function() {
  return gulp.src(["./bower.json", "./package.json"])
    .pipe(bump())
    .pipe(gulp.dest("./"));
});

gulp.task("bump-js", function() {
  return gulp.src(["src/browser-xlsx.js"])
    .pipe(replace(/(v\d+\.\d+\.)(\d+)/g, function(matches, match1, match2) {
      return match1 + (Number(match2) + 1);
    }))
    .pipe(replace(/(version: ["']\d+\.\d+\.)(\d+)/g, function(matches, match1, match2) {
      return match1 + (Number(match2) + 1);
    }))
    .pipe(gulp.dest("src/"))
    .on("end", function() {
      gulp.start("js");
    });
});

gulp.task("bump-typings", function() {
  gulp.src(["dist/browser-xlsx.d.ts"])
    .pipe(replace(/(v\d+\.\d+\.)(\d+)/g, function(matches, match1, match2) {
      return match1 + (Number(match2) + 1);
    }))
    .pipe(gulp.dest("dist/"));
});

gulp.task("bump-readme", function() {
  gulp.src(["gitbook/README.md", "gitbook/READMEv3.md"])
    .pipe(replace(/([/\[`]v?[124567890]\d*\.\d+\.)(\d+)/g, function(matches, match1, match2) {
      return match1 + (Number(match2) + 1);
    }))
    .pipe(gulp.dest("gitbook/"));
});

gulp.task("clean", function() {
  return del(["dist/*.js"]);
});

gulp.task("test", ["build"]);

gulp.task("build", ["js"]);

gulp.task("default", ["build"]);



