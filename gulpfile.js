var gulp = require('gulp');
var less = require('gulp-less');

gulp.task('default', ['less']);

gulp.task('less', function () {
    gulp.src('./less/qlib.less')
        .pipe(less())
        .pipe(gulp.dest('./dist/css'))
});
