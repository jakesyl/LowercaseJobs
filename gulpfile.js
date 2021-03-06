var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");

gulp.task("sass", function() {
  gulp.src('./public/sass/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('./public/css'));
})

gulp.task("watch", function() {
  gulp.watch("./public/sass/**/*.scss", ["sass"]);
})

gulp.task("default",
[
  "sass",
  "watch"
])
