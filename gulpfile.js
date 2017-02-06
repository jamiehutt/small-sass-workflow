// dependencies

var gulp = require('gulp');  
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var minifycss = require('gulp-clean-css');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var neat = require('node-neat');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var reload = browserSync.reload;


/* Setup scss path */
var paths = {
    scss: 'src/sass/*.scss'
};

// manage scripts

gulp.task('scripts', function() {
  return gulp.src([
    /* Add your JS files here, they will be combined in this order */
    './src/js/*.js'
    ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('js'));
});

gulp.task('vendor-scripts', function() {
  return gulp.src([
    // copies plugins from the vendors directory 
    './src/js/vendor/*.js'
    ])
    .pipe(gulp.dest('js/vendor'));
});

// manage SASS

gulp.task('sass', function () {  
    gulp.src('src/scss/app.scss')
    .pipe(plumber())
    .pipe(sass({
        includePaths: ['scss'].concat(neat)
    }))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('css'))
    
    // reload browser after css/js changes

    .pipe(reload({stream:true}));
});

// manage refresh

gulp.task('bs-reload', function () {
    browserSync.reload();
});

// browse-sync preferences

gulp.task('browser-sync', function() {
    browserSync.init(['css/*.css', 'js/*.js'], {
        
        // Set up a proxy if you use MAMP, or another web server
        // proxy: 'your-domain.url'
        
        // to use the gulp server, set the base directory:
        
        server: {
            baseDir: './'
        }       
    });
});

// write out new versions of changed src/css and src/js files

gulp.task('default', ['sass', 'browser-sync', 'scripts', 'vendor-scripts'], function () {
    /* Watch scss, run the sass task on change. */
    gulp.watch(['src/scss/*.scss', 'src/scss/**/*.scss'], ['sass'])
    /* Watch app.js file, run the scripts task on change. */
    gulp.watch(['src/js/*.js'], ['scripts'])
    gulp.watch(['src/js/vendor/*.js'], ['vendor-scripts'])
    /* Watch .html files, run the bs-reload task on change. */
    gulp.watch(['*.html'], ['bs-reload']);
});
