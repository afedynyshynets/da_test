var gulp = require('gulp'),
	concatCss = require('gulp-concat-css'),
	minifyCss = require('gulp-minify-css'),
	livereload = require('gulp-livereload'),
	notify = require('gulp-notify'),
	autoPref = require('gulp-autoprefixer'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	plumber = require('gulp-plumber'),
	connect = require('gulp-connect'),
	headerfooter = require('gulp-headerfooter');

var basePaths = {
    src: 'dev/design/',
    dest : 'app/',
    destdesign : 'app/design/',
    srcsass : 'dev/design/scss/style.scss',
    srcjscustom : 'dev/design/js/custom.js',
    devhtml : 'dev/*.html',
    devcommon : 'dev/common_html/*.html',
    devcommonheader : 'dev/common/header.html',
    devcommonfooter : 'dev/common/footer.html',
    cssname : 'style.css',
    cssnamemin : 'style.min.css',
    jsnamemin : 'custom.min.js'
}

var path = {
    img: {
        src: basePaths.src + 'img/',
        dest: basePaths.destdesign + 'img/',
        all: basePaths.src + 'img/**/**/*'
    },
    images: {
        src: basePaths.src + 'images/',
        dest: basePaths.destdesign + 'images/',
        all: basePaths.src + 'images/**/**/*'
    },
    js: {
        src: basePaths.src + 'js/',
        dest: basePaths.destdesign + 'js/',
        file: basePaths.src + 'js/*.js',
        all: basePaths.src + 'js/**/**/*'
    },
    css: {
        src: basePaths.src + 'css/',
        dest: basePaths.destdesign + 'css/',
        file: basePaths.src + 'css/*.css',
        filejs: basePaths.src + 'css/*.js',
        all: basePaths.src + 'css/**/**/*'
    },
    fonts: {
        src: basePaths.src + 'fonts/',
        dest: basePaths.destdesign + 'fonts/',
        all: basePaths.src + 'fonts/**/**/*'
    },
    scss: {
        src: basePaths.src + 'scss/',
        dest: basePaths.destdesign + 'scss/',
        file: basePaths.src + 'scss/*.scss',
        all: basePaths.src + 'scss/**/**/*'
    }
};

gulp.task('connect', function() {
  connect.server({
    root: 'dev',
    livereload: true
  });
});

gulp.task('app', function() {
	gulp.src(path.css.file)
		.pipe(gulp.dest(path.css.dest));
	gulp.src(path.js.file)
		.pipe(gulp.dest(path.js.dest));
	gulp.src(path.img.all)
		.pipe(imagemin({
	      optimizationLevel: 3,
	      progessive: true,
	      interlaced: true
	    }))
		.pipe(gulp.dest(path.img.dest));
	gulp.src(path.fonts.all)
		.pipe(gulp.dest(path.fonts.dest));
	gulp.src(path.images.all)
		.pipe(imagemin({
	      optimizationLevel: 3,
	      progessive: true,
	      interlaced: true
	    }))
		.pipe(gulp.dest(path.images.dest));
	gulp.src(basePaths.devhtml)
		.pipe(gulp.dest(basePaths.dest));
	gulp.src(basePaths.srcsass)
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoPref({
            browsers: ['last 100 versions'],
            cascade: false,
            remove: false
        }))
		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(rename(basePaths.cssnamemin))
		.pipe(gulp.dest(path.css.dest))
		.pipe(notify('Done!'));
	gulp.src(basePaths.srcsass)
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoPref({
            browsers: ['last 100 versions'],
            cascade: false,
            remove: false
        }))
		.pipe(rename(basePaths.cssname))
		.pipe(gulp.dest(path.css.src))
		.pipe(notify('Done!'));
	gulp.src(basePaths.srcjscustom)
		.pipe(uglify())
		.pipe(rename(basePaths.jsnamemin))
		.pipe(gulp.dest(path.js.dest));
});

gulp.task('watch', function () {
	gulp.watch(path.scss.file, ['app']);
	gulp.watch(path.js.file, ['app']);
	gulp.watch(path.css.filejs, ['app']);
	gulp.watch(basePaths.devhtml, ['app']);
});

gulp.task('dev', function() {
    gulp.src(basePaths.devcommon)
        .pipe(headerfooter.header(basePaths.devcommonheader))
        .pipe(headerfooter.footer(basePaths.devcommonfooter))
        .pipe(gulp.dest('dev/'));
	gulp.src(basePaths.srcsass)
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoPref({
            browsers: ['last 100 versions'],
            cascade: false,
            remove: false
        }))
		.pipe(rename(basePaths.cssname))
		.pipe(gulp.dest(path.css.src))
		.pipe(connect.reload())
		.pipe(livereload())
		.pipe(notify('Done!'));
});
gulp.task('dev-html', function() {
    gulp.src(basePaths.devcommon)
        .pipe(headerfooter.header(basePaths.devcommonheader))
        .pipe(headerfooter.footer(basePaths.devcommonfooter))
        .pipe(gulp.dest('dev/'));
	gulp.src(basePaths.devhtml)
		.pipe(connect.reload())
		.pipe(notify('Done!'));
});
gulp.task('dev-sass', function() {
	gulp.src(basePaths.srcsass)
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoPref({
            browsers: ['last 100 versions'],
            cascade: false,
            remove: false
        }))
		.pipe(rename(basePaths.cssname))
		.pipe(gulp.dest(path.css.src))
		.pipe(connect.reload())
		.pipe(notify('Done!'));
});

gulp.task('watch-dev', ['connect'], function () {
	// gulp.watch([path.scss.file, basePaths.devhtml, basePaths.devcommon, path.js.file], ['dev']);
	// livereload.listen();
	gulp.watch(path.scss.file, ['dev-sass']);
	// gulp.watch(basePaths.devhtml, ['dev-html']);
	gulp.watch(basePaths.devcommon, ['dev-html']);
	gulp.watch([basePaths.devcommonheader, basePaths.devcommonfooter], ['dev-html']);
	// gulp.watch(path.js.file, ['dev']);
});

gulp.task('npmUpdate', function () {
  var update = require('gulp-update');
 
  gulp.watch('./package.json').on('change', function (file) {
    update.write(file);
  });
 
});
 
gulp.task('gu', ['npmUpdate']);