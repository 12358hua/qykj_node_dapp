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
 * 仅开发环境使用
 读取表格目录文件，获取地址进行数据爬取
 */
// Routers.post('/postExcelReptile', Tokens.ExcelReptile);

/**
 * 仅开发环境使用
 读取表格目录文件，导入指定格式数据
 catalogue=文件地址
 */
// Routers.post('/postExcelList', Tokens.postExcelReptile);

module.exports = Routers
