/**
 * ------------------------------------------------------------------
 * weapp-gulp 配置文件
 *
 * 建议复制一份并重命名为 config.custom.js ，即可在config.custom.js 上根据需求进行配置
 * ------------------------------------------------------------------
 *
 * @author  sunnie
 * @link    https://github.com/sunnie1992/weapp-gulp
 * @data    2019-03-05
 */
module.exports = {
	enabledQcloud: false, //是否开启腾讯云COS 上传功能
	enabledQiniu: true, // 是否开启七牛云COS 上传功能
	// 七牛 上传功能配置表
	qiniu: {
		accessKey: 'xxx',
		secretKey: 'xxx',
		bucket: 'xxx',
		prefix: 'weapp',
		private: false,
		delete: false
	},
	// 腾讯云COS 上传功能配置表
	qcloud: {
		appid: '1111111',
		secretId: 'xxx',
		secretKey: 'xxxxx',
		bucket: 'xxxx',
		region: 'sh',
		prefix: '',
		overWrite: true,
		headers: {
			'Cache-Control': 'max-age=5184000'
		}
	},
	// 静态资源CDN 域名，配合CDN 功能实用，线上请确保在mp管理端已经注册域名
	assetsCDN: 'https://www.xxx.com/'
}
