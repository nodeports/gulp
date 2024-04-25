const gulp = require("./node_modules/gulp");
const sass = require("gulp-sass")(require("sass"));
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const del = require("del");

const paths = {
  styles: {
    src: "src/styles/**/*.scss",
    dest: "dist/styles/",
  },
  scripts: {
    src: "src/scripts/**/*.js",
    dest: "dist/scripts/",
  },
  images: {
    src: "src/images/**/*.{jpg,jpeg,png,svg,gif}",
    dest: "dist/images/",
  },
};

function clean() {
  return del(["dist"]);
}

function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp
    .src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(uglify())
    .pipe(concat("main.min.js"))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

function images() {
  return gulp
    .src(paths.images.src)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest));
}

function watchFiles() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.images.src, images);
  gulp.watch("*.html").on("change", browserSync.reload);
}

function browserSyncServe(done) {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  done();
}

const build = gulp.series(clean, gulp.parallel(styles, scripts, images));
const watch = gulp.parallel(watchFiles, browserSyncServe);

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.build = build;
exports.watch = watch;
exports.default = build;
