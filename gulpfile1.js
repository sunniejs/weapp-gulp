/**
 * ------------------------------------------------------------------
 * weapp-gulp gulpfile 文件
 * ------------------------------------------------------------------
 *
 * @author  sunnie
 * @link    https://github.com/sunnie1992/weapp-gulp
 * @data    2019-03-05
 */

var path = require('path')
var gulp = require('gulp')
var sass = require('gulp-sass')
var rename = require('gulp-rename')
var imagemin = require('gulp-imagemin')
var del = require('del')
var replace = require('gulp-replace')
var qiniu = require('gulp-qiniu')
var gulpif = require('gulp-if')
var postcss = require('gulp-postcss')
var gutil = require('gulp-util')
var newer = require('gulp-newer')
var cache = require('gulp-cached')
var debug = require('gulp-debug')
var pxtorpx = require('postcss-px2rpx')
var argv = require('yargs').argv
var config = null

// 获取用户配置
try {
	config = require('./config.custom.js')
} catch (e) {
	try {
		config = require('./config.js')
	} catch (e) {
		log(gutil.colors.red('丢失配置文件(config.js/config.custom.js)'))
	}
}

// 相关路径配置
var paths = {
	src: {
		baseDir: 'src',
		imgDir: 'src/image',
		spriteDir: 'src/assets/sprites',
		scssDir: 'src/assets/scss',
		imgFiles: 'src/image/**/*',
		scssFiles: 'src/**/*.scss',
		baseFiles: ['src/**/*.{png,json,wxs}', '!src/assets/**/*', '!src/image/**/*'],
		assetsDir: 'src/assets',
		assetsImgFiles: 'src/assets/images/**/*.{png,jpg,jpeg,svg,gif}',
		wxmlFiles: 'src/**/*.wxml',
		jsFiles: 'src/**/*.js'
	},
	dist: {
		baseDir: 'dist',
		imgDir: 'dist/image',
		wxssFiles: 'dist/**/*.wxss'
	},
	tmp: {
		baseDir: 'tmp',
		imgDir: 'tmp/assets/images',
		imgFiles: 'tmp/assets/images/**/*.{png,jpg,jpeg,svg,gif}'
	}
}
// Log for output msg.
function log() {
	var data = Array.prototype.slice.call(arguments)
	gutil.log.apply(false, data)
}

// 压缩图片
function imageMin() {
	return gulp
		.src(paths.src.imgFiles)
		.pipe(newer(paths.dist.imgDir))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }]
			})
		)
		.pipe(gulp.dest(paths.dist.imgDir))
}

// assets 文件夹下的图片处理
function assetsImgMin() {
	return gulp
		.src(paths.src.assetsImgFiles)
		.pipe(newer(paths.tmp.imgDir))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }]
			})
		)
		.pipe(gulp.dest(paths.tmp.imgDir))
}

// Sass 编译
function sassCompile() {
	var res = config.assetsCDN + config.qiniu.prefix + '/'
	return gulp
		.src(paths.src.scssFiles)
		.pipe(sass({ errLogToConsole: true, outputStyle: 'expanded' }).on('error', sass.logError))
		.pipe(gulpif(Boolean(argv.debug), debug({ title: '`sassCompile` Debug:' })))
		.pipe(postcss([pxtorpx()]))
		.pipe(
			rename({
				extname: '.wxss'
			})
		)
		.pipe(replace('.scss', '.wxss'))
		.pipe(replace('%CDN_IMG%/', res))
		.pipe(gulp.dest(paths.dist.baseDir))
}

// 复制基础文件
function copyBasicFiles() {
	return gulp.src(paths.src.baseFiles, {}).pipe(gulp.dest(paths.dist.baseDir))
}

// 复制 WXML
function copyWXML() {
	return gulp.src(paths.src.wxmlFiles, {}).pipe(gulp.dest(paths.dist.baseDir))
}
// 重写WXML 中 image 标签中的图片路径, 不能与copyWXML 一起使用，需要%CDN_IMG%/重写则注释调用copyWXML
function wxmlImgRewrite() {
	var res = config.assetsCDN + config.qiniu.prefix + '/'
	return gulp
		.src(paths.src.wxmlFiles)
		.pipe(replace('%CDN_IMG%/', res))
		.pipe(gulp.dest(paths.dist.baseDir))
}

function jsImgRewrite() {
	var res = config.assetsCDN + config.qiniu.prefix + '/'
	return gulp
		.src(paths.src.jsFiles)
		.pipe(replace('%CDN_IMG%/', res))
		.pipe(gulp.dest(paths.dist.baseDir))
}

// clean 任务, dist 目录
function cleanDist() {
	return del(paths.dist.baseDir)
}

// clean tmp 目录
function cleanTmp() {
	return del(paths.tmp.baseDir)
}
// 七牛云上传任务
function qiniuCDN() {
	if (config.enabledQiniu) {
		return new Promise(function(resolve, reject) {
			gulp.src(paths.tmp.imgFiles)
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
var watchHandler = function(type, file) {
	var extname = path.extname(file)
	// SCSS 文件
	if (extname === '.scss') {
		if (type === 'removed') {
			var tmp = file.replace('src/', 'dist/').replace(extname, '.wxss')
			del([tmp])
		} else {
			sassCompile()
		}
	} else if (extname === '.png' || extname === '.jpg' || extname === '.jpeg' || extname === '.svg' || extname === '.gif') {
		// 图片文件
		if (type === 'removed') {
			if (file.indexOf('assets') > -1) {
				del([file.replace('src/', 'tmp/')])
			} else {
				del([file.replace('src/', 'dist/')])
			}
		} else {
			imageMin()
			assetsImgMin()
			qiniuCDN()
			wxmlImgRewrite()
			jsImgRewrite()
		}
	} else if (extname === '.wxml') {
		// wxml
		if (type === 'removed') {
			var tmp = file.replace('src/', 'dist/')
			del([tmp])
		} else {
			// copyWXML()
			wxmlImgRewrite()
		}
	} else if (extname === '.js') {
		// wxml
		if (type === 'removed') {
			var tmp = file.replace('src/', 'dist/')
			del([tmp])
		} else {
			jsImgRewrite()
		}
	} else {
		// 其余文件
		if (type === 'removed') {
			var tmp = file.replace('src/', 'dist/')
			del([tmp])
		} else {
			copyBasicFiles()
			// copyWXML();
			// wxmlImgRewrite();
		}
	}
}

//监听文件
function watch(cb) {
	var watcher = gulp.watch([paths.src.baseDir, paths.tmp.imgDir], {
		ignored: /[\/\\]\./
	})
	watcher
		.on('change', function(file) {
			log(gutil.colors.yellow(file) + ' is changed')
			watchHandler('changed', file)
		})
		.on('add', function(file) {
			log(gutil.colors.yellow(file) + ' is added')
			watchHandler('add', file)
		})
		.on('unlink', function(file) {
			log(gutil.colors.yellow(file) + ' is deleted')
			watchHandler('removed', file)
		})

	cb()
}

//注册默认任务
gulp.task(
	'default',
	gulp.series(
		//  cleanTmp,
		copyBasicFiles,
		// gulp.parallel(sassCompile, imageMin, copyWXML), // 不需要%CDN_IMG%/重写
		gulp.parallel(sassCompile, imageMin, wxmlImgRewrite, jsImgRewrite), // 需要%CDN_IMG%/重写
		assetsImgMin,
		qiniuCDN,
		watch
	)
)

//注册测试任务
gulp.task(
	'test',
	gulp.series(
		//  cleanTmp,
		copyBasicFiles,
		// gulp.parallel(sassCompile, imageMin, copyWXML), // 不需要%CDN_IMG%/重写
		gulp.parallel(sassCompile, imageMin, wxmlImgRewrite, jsImgRewrite), // 需要%CDN_IMG%/重写
		assetsImgMin,
		qiniuCDN
	)
)

// 删除任务
gulp.task('clean', gulp.parallel(cleanTmp, cleanDist))
