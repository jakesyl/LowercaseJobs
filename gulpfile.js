var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var nodemon = require('gulp-nodemon');


gulp.task("sass", function() {
  gulp.src('client/sass/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('client/css'));
})

gulp.task("watch", function() {
  gulp.watch("client/sass/**/*.scss", ["sass"]);
})

gulp.task('start', function () {
  nodemon({
    script: 'server/server.js'
  , env: { 'NODE_ENV': 'development' }
  })
})

gulp.task("default",
[
  "sass",
  "watch",
  "start"
]
)
