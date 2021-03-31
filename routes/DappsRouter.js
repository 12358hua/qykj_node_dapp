const Router = require('koa-router')
const Dapps = require('../src/controller/DappsController')

const Routers = new Router({
    prefix: '/dapps' //接口前缀
})

/**
 * 查询 dapps/index
 * get
 * @params{
 *     location:string, 必须
 *     language:string  必须
 * }
 */
Routers.get('/index', Dapps.DappsList);

/**
 * get
 * 获取dapps列表  dapps/search
 * @param {
 *     keyword:查询条件：keyword不传默认拿到20条所有状态数据(可选)
 * }
 * @header {
 *     location:国家（可选）默认为cn中国
 *     language:语言（可选）默认为en英文
 * }
 * @returns dapps列表数据
 */
Routers.get('/search', Dapps.DappsSearchList);

/**
 * post
 * 修改状态是否为热门 dapps/updateIndex
 * @param {
 *     id:代币id（必须）
 *     isIndex:大于1为开启，小于为关闭，不传默认所有状态（必须）
 * }
 * @returns null
 */
// Routers.post('/updateIndex', Dapps.DappsUpdateIsIndex);

module.exports = Routers
