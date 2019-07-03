//接入服务器接口地址根目录
//本地开发，就把CONFIG 设置成0
//测试环境，就把CONFIG 设置成1
//生产环境，就把CONFIG 设置成2
const CONFIG = 0
const environment = ['env', 'sit', 'prod']
const env = require(`./_config_${environment[CONFIG]}`)
module.exports = env
