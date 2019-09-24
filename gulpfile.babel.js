import path from 'path'
import gulp from 'gulp'
import babel from 'gulp-babel'
import sass from 'gulp-sass'
import uglify from 'gulp-uglify'
import cleanCSS from 'gulp-clean-css'
import rename from 'gulp-rename'
import postcss from 'gulp-postcss'
import del from 'del'
import imagemin from 'gulp-imagemin'
import qiniu from 'gulp-qiniu'
import gulpif from 'gulp-if'
import gutil from 'gulp-util'
import replace from 'gulp-replace'
import newer from 'gulp-newer'
import cache from 'gulp-cached'
import debug from 'gulp-debug'
import pxtorpx from 'postcss-px2rpx'
import argv from 'yargs'

// 配置环境
const ENV = process.env.NODE_ENV
// const isDev = ENV === 'development' || ENV === 'dev'
const isProd = ENV === 'production' || ENV === 'prod'
var config = null
// 获取用户配置
try {
	config = require(`./config.custom.js`)
} catch (e) {
	try {
		config = require('./config.js')
	} catch (e) {
		log(gutil.colors.red('丢失配置文件(config.js)'))
	}
}
const buildPath = path.join(__dirname, 'dist/')
const tmpPath = path.join(__dirname, 'tmp/')
const format = isProd ? false : 'beautify'

const paths = {
	styles: {
		src: ['src/**/*.scss'],
		dest: buildPath
	},
	images: {
		src: 'src/assets/images/**/*.{png,jpg,jpeg,svg,gif}',
		dest: buildPath
	},
	scripts: {
		src: 'src/**/*.js',
		dest: buildPath
	},
	copy: {
		src: ['src/**', '!src/**/*.scss', '!src/icon/fonts/**', '!src/assets/images/**'],
		dest: buildPath
	},
	tmp: {
		src: 'tmp/assets/images/**/*.{png,jpg,jpeg,svg,gif}',
		dest: 'tmp/'
	}
}
// Log for output msg.
function log() {
	var data = Array.prototype.slice.call(arguments)
	gutil.log.apply(false, data)
}

export const clean = () => del([buildPath, tmpPath])

// assets 文件夹下的图片处理
export const upload = () => {
	if (config.enabledQiniu) {
		return new Promise(function(resolve, reject) {
			gulp.src(paths.tmp.src)
				.pipe(cache('qcloudCache'))
				.pipe(
					qiniu(
						{
							accessKey: config.qiniu.accessKey,
							secretKey: config.qiniu.secretKey,
							bucket: config.qiniu.bucket,
							domin: config.qiniu.domin,
							private: config.qiniu.private
						},
						{
							dir: config.qiniu.prefix // 前缀
						}
					)
				)
			resolve()
		})
	}
}
// Sass 编译

// assets 文件夹下的图片处理
export const images = () =>
	gulp
		.src(paths.images.src, { base: 'src' })
		.pipe(newer(paths.tmp.dest))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }]
			})
		)
		.pipe(gulp.dest(paths.tmp.dest))

export const styles = () =>
	gulp
		.src(paths.styles.src, { base: 'src' })
		.pipe(sass({ errLogToConsole: true, outputStyle: 'expanded' }).on('error', sass.logError))
		.pipe(gulpif(Boolean(argv.debug), debug({ title: '`sassCompile` Debug:' })))
		.pipe(postcss([pxtorpx()]))
		.pipe(replace('%CDN_IMG%/', config.assetsCDN + config.qiniu.prefix + '/'))
		.pipe(cleanCSS({ format }))
		.pipe(rename(path => (path.extname = '.wxss')))
		.pipe(gulp.dest(paths.styles.dest))

export const scripts = () =>
	gulp
		.src(paths.scripts.src, { base: 'src' })
		.pipe(babel())
		.pipe(replace('%CDN_IMG%/', config.assetsCDN + config.qiniu.prefix + '/'))
		.pipe(uglify())
		.pipe(gulp.dest(paths.scripts.dest))

export const copy = () =>
	gulp
		.src(paths.copy.src, { base: 'src' })
		.pipe(replace('%CDN_IMG%/', config.assetsCDN + config.qiniu.prefix + '/'))
		.pipe(gulp.dest(paths.copy.dest))

const watchFiles = () => {
	gulp.watch(paths.styles.src, styles).on('unlink', function(file) {
		log(gutil.colors.yellow(file) + ' is deleted')
		var tmp = file.replace(/src\\/, 'dist\\')
		del([tmp])
	})
	gulp.watch(paths.copy.src, copy).on('unlink', function(file) {
		log(gutil.colors.yellow(file) + ' is deleted')
		var tmp = file.replace(/src\\/, 'dist\\')
		del([tmp])
	})
	gulp.watch(paths.images.src, images).on('unlink', function(file) {
		log(gutil.colors.yellow(file) + ' is deleted')
		var tmp = file.replace(/src\\/, 'tmp\\')
		del([tmp])
	})
	gulp.watch(paths.tmp.src, upload)
}
export { watchFiles as watch }

export default gulp.series(gulp.parallel(styles, copy, images), upload, watchFiles)

export const build = gulp.series(clean, gulp.parallel(styles, copy, images), upload, scripts)
