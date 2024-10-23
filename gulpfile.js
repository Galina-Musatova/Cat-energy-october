import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';

import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import sourcemap from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import webp from 'gulp-webp';
//import del from 'del';
//import svgstore from 'gulp-svgstore'; Надо добавить для отображения иконки, но выходит в ошибку
//import {deleteAsync} from 'del';



// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest('build/css'))
    .pipe(browser.stream());
}


/*HTML*/
export const html = ()  => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'));

}
// scripts

export const scripts = () => {
    return gulp.src('source/**/*.js')
        .pipe(terser())
        .pipe(rename('script.min.js'))
        .pipe(gulp.dest('build/js'))
}
// Images
export const optimizeImages = () => {
    return gulp.src('source/**/*.{jpg,png,svg}')
        .pipe(squoosh())
        .pipe(gulp.dest('build/img'));
}

export const copyImages = () => {
    return gulp.src('source/**/*.{jpg,png,svg}')
        .pipe(gulp.dest('build/img'));
}
//Webr
export const createWebp = () => {
    return gulp.src("source/img/**/*.{jpg,png}")
        .pipe(webp({quality: 90}))
        .pipe(gulp.dest("build/img"))
}
// Sprite
export const sprite = () => {
    return gulp.src("source/img/icon-32.svg")
   //     .pipe(svgstore({inlineSvg: true
   //})) Надо добавить для отображения иконки, но выходит в ошибку
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("build/img"))
}

//Copy
export const copy = (done) => {
    gulp.src([
        "source/fonts/**/*.{woff2,woff}",
        "source/**/*.ico",
        "source/img/**/*.svg",
        "!source/img/icons/*.svg",
    ], {
        base: "source"
    })
    .pipe(gulp.dest("build"))
    done();
}

//Clean
export const clean = () => {
    return del("build");    
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}


export default gulp.series(
  styles, html, server, watcher, optimizeImages, copyImages, createWebp, copy
);
