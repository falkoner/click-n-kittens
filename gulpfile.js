var gulp = require('gulp');
var ngrok = require('ngrok');
var psi = require('psi');
var sequence = require('run-sequence');
var browserSync = require('browser-sync');
var taskListing = require('gulp-task-listing');
var imageop = require('gulp-image-optimization');
var minifyCss = require('gulp-minify-css');
var minifyhtml = require('gulp-minify-html');
var uglify = require('gulp-uglify');
var del = require('del');
var inject = require('gulp-inject');
var ghPages = require('gulp-gh-pages');

var site = '';
var portVal = 3020;

var source = {
  all: ['source/'],
  scripts: ['source/js/*.js'],
  styles: ['source/css/*.css'],
  styles_injectable: ['source/css/style.css'],
  images: ['source/img/*'],
  content: ['source/*.html']
};

var dest = {
  all_assets: 'dest/*/**',
  all_html: 'dest/*.html',
  scripts: 'dest/js/',
  styles: 'dest/css/',
  images: 'dest/img/',
  content: 'dest/'
};

gulp.task('deploy', function() {
  return gulp.src([dest.all_assets, dest.all_html])
    .pipe(ghPages());
});

gulp.task('psi', function(cb) {
  sequence(
    'clean',
    'build',
    'psi-seq',
    cb
  );
});

gulp.task('serve', function(cb) {
  sequence(
    'clean',
    'build_dev',
    '_browse',
    cb
  );
});

gulp.task('build', ['_scripts', '_styles','_images', '_content']);
gulp.task('build_dev', ['_scripts_dev', '_styles_dev','_images', '_content_dev']);

gulp.task('help', taskListing.withFilters(null, 'default'));

gulp.task('default', ['help']);

gulp.task('clean', function(){
  del([dest.all_assets, dest.all_html]).then(function (paths) {
      console.log('Deleted files/folders:\n', paths.join('\n'));
  });
});

gulp.task('_browse', function(){
    browserSync({
        port: 3030,
        browser: "google chrome",
        server: {
            baseDir: dest.content
        }
    });

    gulp.watch(source.scripts, ['script-watch']);
    gulp.watch(source.styles, ['css-watch']);
    gulp.watch(source.content, ['content-watch']);
    gulp.watch(source.images, ['image-watch']);
});

gulp.task('_styles', function(){
  return gulp.src(source.styles)
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest(dest.styles));
});

gulp.task('_styles_dev', function(){
  return gulp.src(source.styles)
    .pipe(gulp.dest(dest.styles));
});

gulp.task('_images', function() {
    return gulp.src(source.images)
      .pipe(imageop({
          optimizationLevel: 7
      }))
      .pipe(gulp.dest(dest.images));
});

gulp.task('_scripts', function() {
    return gulp.src(source.scripts)
        .pipe(uglify())
        .pipe(gulp.dest(dest.scripts));
});

gulp.task('_scripts_dev', function() {
    return gulp.src(source.scripts)
        .pipe(gulp.dest(dest.scripts));
});

gulp.task('_content', function() {
    return gulp.src(source.content)
        .pipe(inject(gulp.src(source.styles_injectable).pipe(minifyCss({compatibility: 'ie8'})), {
          starttag: '/* inject:head:css */',
          endtag: '/* endinject */',
          transform: function (filePath, file) {
            return file.contents.toString('utf8');
          }
        }))
        .pipe(minifyhtml({
            empty: true,
            quotes: true
        }))
        .pipe(gulp.dest(dest.content));
});

gulp.task('_content_dev', function() {
    return gulp.src(source.content)
        .pipe(inject(gulp.src(source.styles_injectable), {
          starttag: '/* inject:head:css */',
          endtag: '/* endinject */',
          transform: function (filePath, file) {
            return file.contents.toString('utf8');
          }
        }))
        .pipe(gulp.dest(dest.content));
});

gulp.task('css-watch', ['_styles'], browserSync.reload);
gulp.task('content-watch', ['_content'], browserSync.reload);
gulp.task('image-watch', ['_images'], browserSync.reload);
gulp.task('script-watch', ['_scripts'], browserSync.reload);


gulp.task('ngrok-url', function(cb) {
  return ngrok.connect(portVal, function (err, url) {
    site = url;
    console.log('serving your tunnel from: ' + site);
    cb();
  });
});

gulp.task('psi-desktop', function(cb) {
  psi.output( site, {
    nokey: 'true',
    strategy: 'desktop',
    threshold: 20
  },cb);
});

gulp.task('psi-mobile', function(cb) {
  psi.output( site, {
    nokey: 'true',
    strategy: 'mobile',
    threshold: 20
  },cb);
});

gulp.task('browser-sync-psi', function(cb) {
  browserSync({
    port: portVal,
    open: false,
    server: {
      baseDir: dest.content
    }
  },cb);
});

gulp.task('psi-seq', function(cb) {
  sequence(
    'browser-sync-psi',
    'ngrok-url',
    'psi-desktop',
    'psi-mobile',
    cb
  );
});
