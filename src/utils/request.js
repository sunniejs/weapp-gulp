/**
 *   skyvow/wx-extend 微信小程序 - 扩展插件
 *   https://github.com/skyvow/wx-extend/blob/master/docs/components/request.md
 */
import WxRequest from '../plugins/wx-request/lib/index'
import { BASE_API } from '../config/index'

const service = new WxRequest({
	baseURL: BASE_API
})
service.interceptors.use({
	request(request) {
		// 请求头
		request.header = request.header || {}
		request.header['content-type'] = 'application/x-www-form-urlencoded;charset=utf-8'
		// loading
		wx.showLoading({
			title: '加载中',
			mask: true
		})
		return request
	},
	// 请求失败
	requestError(requestError) {
		wx.hideLoading()
		return Promise.reject(requestError)
	},
	response(response) {
		wx.hideLoading()
		const res = response.data
		// if the custom code is not 200, it is judged as an error.
		if (res.status && res.status !== 200) {
			// 登录失效，超时
			if (res.status === 401) {
				// wx.removeStorageSync('utoken')
			} else {
				wx.showToast({ title: res.message || 'error', icon: 'none' })
			}
			return Promise.reject(res.message || 'error')
		} else {
			return res
		}
	},
	// 响应失败
	responseError(responseError) {
		// 响应错误处理
		wx.hideLoading()
		wx.showToast({ title: '喔噢,网络好像出现问题了~', icon: 'none' })
		return Promise.reject(responseError)
	}
})
export default service
