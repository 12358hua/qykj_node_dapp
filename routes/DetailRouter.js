const Router = require('koa-router')
const Detail = require('../src/controller/DetailController')

const Routers = new Router({
    prefix: '/tokens' //接口前缀
})

/**
 * 查询 tokens/search
 * get
 * @params{
 *     keyword:string  可选
 * }
 */
 Routers.get('/search', Detail.DetailSearch);

 /**
 * 查询 tokens/standard
 * get
 */
 Routers.get('/standard', Detail.DetailSearch);

  /**
 * 查询 tokens/hotlist
 * get
 */
 Routers.get('/hotlist', Detail.DetailSearch);

 /**
 * 查询 tokens/detail
 * get
 */
  Routers.get('/detail', Detail.DetailAddress);

module.exports = Routers
