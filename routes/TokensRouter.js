const Router = require('koa-router')
const Tokens = require('../src/controller/TokensController.js')

const Routers = new Router({
    prefix: '/tokens' //接口前缀
})

/**
 * 查询 tokens/search
 * get
 * @params{
 *     keyword:string  （必选）
 * }
 * @header {
 *     location:国家（可选）默认为cn中国
 *     language:语言（可选）默认为en英文
 * }
 */
 Routers.get('/search', Tokens.TokensSearch);

 /** get
 * 查询 tokens/standard
 * @params{
 *     hot:int  （按需选填） 0/不传为所有，1为热门
 * }
 * @header {
 *     location:国家（可选）默认为cn中国
 *     language:语言（可选）默认为en英文
 * }
 */
 Routers.get('/standard', Tokens.TokensSearch);

  /** get
 * 查询 tokens/hotlist
 * @params{
 *     hot:int  （按需选填） 0/不传为所以，1为热门
 * }
 * @header {
 *     location:国家（可选）默认为cn中国
 *     language:语言（可选）默认为en英文
 * }
 */
 Routers.get('/hotlist', Tokens.TokensSearch);

 /** get
 * 查询 tokens/detail
 * @params{
 *     address:string  （必选）
 * }
 * @header {
 *     location:国家（可选）默认为cn中国
 *     language:语言（可选）默认为en英文
 * }
 */
 Routers.get('/detail', Tokens.TokensAddress);

/**
 * post
 * 修改状态是否为热门 tokens/updateIndex
 * @params {
 *     id:string  代币id（必须）
 *     hotSort:int  大于1为开启，小于为关闭，不传默认所有状态（必须）
 * }
 * @returns null
 */
// Routers.post('/updateIndex', Tokens.TokensUpdateIsIndex);

module.exports = Routers
