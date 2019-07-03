import { getAppInfo } from '../../api/app'
//index.js
//获取应用实例
var app = getApp()
Page({
	data: {
		appInfo: {}
	},
	onLoad: function() {
		// 请求数据
		getAppInfo().then(res => {
			this.setData({
				appInfo: res.data.app
			})
		})
	}
})
