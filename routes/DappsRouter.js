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



module.exports = Routers
