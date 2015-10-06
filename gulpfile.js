'use strict';

let RES_DIR       = 'resources/assets',
    gulp          = require('gulp'),
    hash          = require('gulp-hash'),
    uglify        = require('gulp-uglify'),
    concat        = require('gulp-concat'),
    del           = require('del'),
    imagemin      = require('gulp-imagemin'),
    babel         = require('gulp-babel'),
    sourcemaps    = require('gulp-sourcemaps'),
    minifyCss     = require('gulp-minify-css'),
    plumber       = require('gulp-plumber'),
    sass          = require('gulp-ruby-sass'),
    gulpFilter    = require('gulp-filter'),
    config        = require('./gulp/config'),
    resources = {
      js: RES_DIR + '/js/**/*.js',
      js_modules: RES_DIR + '/js/**/*.module.js',
      images: RES_DIR + '/img/*',
      vendor_js: ['bower_components/jquery/dist/jquery.js',
                  'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js']
    },
    destinations = {
      js: 'web/js',
      images: 'web/img',
      styles: 'web/styles'
    };

gulp.task('clean', function () {
    return del([
      'web/js/**/*.js',
      'web/js/**/*.js.map',
      'web/img/**/*.{png,jpeg,jpg,gif}',
      RES_DIR + '/rev-manifest.json',
      '.sass-cache/**/*',
      'web/css/**/*'
    ]);
});

gulp.task('scripts', function(done) {
  // jquery and other vendor stuff is more likely to be cached for long time spans, hence a single file
  gulp.src(resources.vendor_js)
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat('js/vendor.js'))
      .pipe(hash({template: "<%= name %>.<%= hash %>.min<%= ext %>"}))
      .pipe(sourcemaps.write('.'), {sourceRoot: RES_DIR})
      .pipe(gulp.dest('web')) // Write the renamed files
      .pipe(hash.manifest('rev-manifest.json', true)) // Switch to the manifest file
      .pipe(gulp.dest(RES_DIR)); // Write the manifest file

  // todo: clean code
  gulp.src([resources.js, '!'+resources.js_modules]) // modules are to be loades async
      .pipe(sourcemaps.init())
      .pipe(babel()) // include { optional: ['runtime'] } if generators are used
      .pipe(uglify())
      .pipe(concat('js/application.js')) // concatenate all files into one
      .pipe(hash({template: "<%= name %>.<%= hash %>.min<%= ext %>"})) // Add hashes to the files' name(s)
      .pipe(sourcemaps.write('.', {sourceRoot: RES_DIR}))
      .pipe(gulp.dest('web')) // Write the renamed files
      .pipe(hash.manifest('rev-manifest.json', true)) // Switch to the manifest file
      .pipe(gulp.dest(RES_DIR)); // Write the manifest file
  done();
});

gulp.task('styles', function(done) {
  let filter = gulpFilter(['*.css', '!*.map'], {restore: true});

  return sass(config.sass.src, config.sass.options)
    .on('error', sass.logError)
    .pipe(sourcemaps.init())
    .pipe(concat('css/style.css'))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(hash({template: "<%= name %>.<%= hash %>.min<%= ext %>"}))
    .pipe(gulp.dest('web'))
    .pipe(filter) // Don’t write sourcemaps of sourcemaps
    .pipe(sourcemaps.write('.', { includeContent: false, addComment: true, sourceRoot: RES_DIR }))
    .pipe(filter.restore) // Restore original files
    .pipe(hash.manifest('rev-manifest.json', true)) // Switch to the manifest file
    .pipe(gulp.dest(RES_DIR));
});

// Copy all static images
gulp.task('images', function() {
  return gulp.src(resources.images)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('web/img'));
});

// Rerun the task when a file changes
// gulp.task('watch', function() {
//   gulp.watch(resources.scripts, ['scripts']);
//   gulp.watch(resources.images, ['images']);
// });

gulp.task('default',
  gulp.series('clean',
    gulp.parallel('scripts', 'styles', 'images'),
    function (done) {
      done();
    }
  )
);
