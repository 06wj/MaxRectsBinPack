var gulp = require('gulp');
var rimraf = require('gulp-rimraf');
var uglify = require('gulp-uglify');

gulp.task('clean', function () {
    return gulp.src(['build'])
        .pipe(rimraf({ force: true }));
});

gulp.task('build', ['clean'], function(){
    return gulp.src('src/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['build']);
});
gulp.task('default', ['build']);