const { src, dest, parallel, series, watch } = require("gulp");

// Load plugins

const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cssnano = require("gulp-cssnano");
const concat = require("gulp-concat");
const clean = require("gulp-clean");
const imagemin = require("gulp-imagemin");
const changed = require("gulp-changed");
const browsersync = require("browser-sync").create();
const reload = browsersync.reload;
const cleanCSS = require("gulp-clean-css");

// Clean assets

function clear() {
  return src("./assets/*", {
    read: false,
  }).pipe(clean());
}

// coding List CSS function
function codingListCss() {
  const source = "./src/codingList.scss";

  return src(source, { sourcemaps: true })
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    )

    .pipe(dest("./codingList/", { sourcemaps: true }))
    .pipe(browsersync.stream());
}

// JS function
function js() {
  const source = "./src/js/*.js";

  return (
    src(source)
      .pipe(changed(source))
      .pipe(concat("bundle.js"))
      // minifies JS files
      // .pipe(uglify())
      // adds .min to the name of the compiled file
      // .pipe(rename({
      //     extname: '.min.js'
      // }))
      .pipe(dest("./assets/js/"))
      .pipe(browsersync.stream())
  );
}

// CSS function
function css() {
  const source = "./src/scss/**";

  return (
    src(source, { sourcemaps: true })
      // .pipe(changed(source))
      .pipe(sass({ outputStyle: "expanded" }))
      // .pipe(cleanCSS())
      .pipe(
        autoprefixer({
          overrideBrowserslist: ["last 2 versions"],
          cascade: false,
        })
      )
      // adds .min to the name of the compiled file
      // .pipe(rename({
      //     extname: '.min.css'
      // }))
      // minifies the CSS file
      // .pipe(cssnano())
      .pipe(concat("style.css"))
      .pipe(dest("./assets/css/", { sourcemaps: true }))
      .pipe(browsersync.stream())
  );
}

// Optimize images
function images() {
  return src("./src/images/*").pipe(imagemin()).pipe(dest("./assets/images"));
}

// Watch files

function watchFiles() {
  watch("./src/codingList.scss", codingListCss);
  watch("./src/scss/**", css);
  watch("./src/js/*", js);
  watch("./src/images/*", images);
}

// BrowserSync

function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./",
    },
    port: 3000,
  });

  watch("./html/**").on("change", reload);
}

// Tasks to define the execution of the functions simultaneously or in series
exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clear, parallel(js, css, images, codingListCss));
