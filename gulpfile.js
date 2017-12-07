'user strict';

var gulp         = require('gulp');
var sourcemaps   = require('gulp-sourcemaps');
var sass         = require('gulp-sass');
var uglify       = require('gulp-uglify');
var browserSync  = require('browser-sync').create();

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch( ["./js/*.js"], ['js'] );
    gulp.watch( ['./style/*.scss'], ['sass'] );

});

gulp.task('js', function(){

    gulp.src('./js/bc-monitor-popup.js')
        .pipe(uglify())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./'))
        .pipe( gulp.dest('./dist/popup') );

    gulp.src('./js/bc-monitor-content.js')
        .pipe(uglify())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./'))
        .pipe( gulp.dest('./dist/content_scripts') );

    gulp.src('./js/bc-monitor-background.js')
        .pipe(uglify())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./'))
        .pipe( gulp.dest('./dist/background') );

    gulp.src('./js/options.js')
        .pipe(uglify())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./'))
        .pipe( gulp.dest('./dist/options') );

});

gulp.task('sass', function(){

    return gulp.src('./style/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/popup'));

});

gulp.task('default',[ 'browser-sync']);