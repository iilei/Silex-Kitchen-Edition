var gulp      = require('gulp'),
    util      = require('gulp-util'),
    hash      = require('gulp-hash'),
    uglify    = require('gulp-uglify'),
    concat    = require('gulp-concat'),
    del       = require('del'),
    imagemin  = require('gulp-imagemin'),
    babel     = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    RES_DIR = 'resources/assets',
    resources = {
      js: RES_DIR + '/js/**/*.js',
      js_modules: RES_DIR + '/js/**/*.module.js',
      images: RES_DIR + '/img/*'
    },
    destinations = {
      js: 'web/assets/js',
      images: 'web/assets/img'
    };

gulp.task('clean', function () {
    return del([
      'web/assets/js/**/*.js',
      'web/assets/js/**/*.js.map',
      'web/assets/img/**/*'
    ]);
});

gulp.task('scripts', function(done) {
  gulp.src([resources.js, '!'+resources.js_modules]) // modules are to be loades async
      .pipe(sourcemaps.init())
      .pipe(babel()) // include { optional: ['runtime'] } if generators are used
      .pipe(uglify())
      .pipe(concat('js/application.js')) // concatenate all files into one
      .pipe(hash({template: "<%= name %>.<%= hash %>.min<%= ext %>"})) // Add hashes to the files' name(s)
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('web/assets')) // Write the renamed files
      .pipe(hash.manifest('rev-manifest.json')) // Switch to the manifest file
      .pipe(gulp.dest(RES_DIR)); // Write the manifest file

  done();
});

// Copy all static images
gulp.task('images', function() {
  return gulp.src(resources.images)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('web/assets/img'));
});

// Rerun the task when a file changes
// gulp.task('watch', function() {
//   gulp.watch(resources.scripts, ['scripts']);
//   gulp.watch(resources.images, ['images']);
// });

gulp.task('default', gulp.series('clean', 'scripts', 'images', function(done) {
  // do more stuff
  done();
}));
