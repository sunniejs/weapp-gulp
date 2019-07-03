import request from '../utils/request'
/**
 *  实例方法
 *  request.getRequest(url, config)
 *  request.postRequest(url, config)
 *  request.putRequest(url, config)
 *  request.deleteRequest(url, config)
 *  request.headRequest(url, config)
 *  request.optionsRequest(url, config)
 *  request.traceRequest(url, config)
 *  request.connectRequest(url, config)
 *  使用说明
 *   https://github.com/skyvow/wx-extend/blob/master/docs/components/request.md
 */
export function getAppInfo(params) {
	return request.getRequest('/app/info', {
		data: params
	})
}
