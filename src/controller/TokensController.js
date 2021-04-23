const TokensModel = require('../model/TokensModel');
const { SuccessModel, ErrorModel } = require('../../utils/Reslut');
const { isNull } = require('../../utils/Regular');
// const fs = require('fs')
const xlsx = require('node-xlsx');
const koaRequest = require('koa2-request')
const {handleDate} = require('../../utils/Packaging')
const UUID = require('uuid')

class Tokens {
    /**
     * 修改状态是否为热门
     * @param ctx
     */
    static
    async TokensUpdateIsIndex(ctx) {
        let hotSort = ctx.request.query.hotSort || ctx.request.body.hotSort;
        let id = ctx.request.query.id || ctx.request.body.id;
        if(!hotSort || !id){
            ctx.body = new ErrorModel(400,'缺少字段值',null)
            return;
        }

        try {
            const data = await TokensModel.TokensUpdateIsIndex(id,hotSort);
            if(data[0] == 0 || data == null){
                ctx.body = new ErrorModel(400,'该币不存在',null)
                return;
            }
            ctx.body =  new SuccessModel('修改成功',null)
        } catch (err) {
            console.log(err)
            ctx.body = new ErrorModel(500,'服务器访问出错',null)
        }
    }

    /**
     * 获取tokens列表
     * @param ctx
     * @returns
     */
    static
    async TokensSearch(ctx) {
        let keyword = ctx.request.query.keyword;
        // let hot = ctx.request.query.hot;
        let location = ctx.request.header.location;
        let language = ctx.request.header.language;

        if(ctx.request.url.indexOf('/tokens/search') >= 0){
            if(isNull(keyword)){
                ctx.body = new ErrorModel(400,'缺少keyword字段值',null)
                return;
            }
        }

        try {
            let data = null;
            let usl = ctx.request.url.indexOf('/tokens/hotlist') >= 0?'hotlist':'standard';
            if(ctx.request.url.indexOf('/tokens/hotlist') >= 0 || ctx.request.url.indexOf('/tokens/standard') >= 0){
                data = await TokensModel.FindTokensList(usl,location,language);
            }else{
                data = await TokensModel.FindTokenKeyword(keyword,location,language);
            }
            ctx.body =  new SuccessModel('获取成功',data)
        } catch (err) {
            console.log(err)
            ctx.body = new ErrorModel(500,'服务器访问出错',null)
        }
    }

     /**
     * 获取tokens
     * @param ctx
     * @returns
     */
      static
      async TokensAddress(ctx) {
          let address = ctx.request.query.address;
          let location = ctx.request.header.location;
          let language = ctx.request.header.language;

          // if(isNull(address)){
          //      ctx.body = new ErrorModel(400,'缺少address字段值',null)
          //      return;
          // }

          try {
              const data = await TokensModel.FindTokensDetail(address,location,language);
              if(data != null){
                  ctx.body =  new SuccessModel('获取成功',data)
              }else{
                  ctx.body = new ErrorModel(400,'没有查到您要的内容',null)
              }
          } catch (err) {
              console.log(err)
              ctx.body = new ErrorModel(500,'服务器访问出错',null)
          }
      }

    /**
     * 读取表格目录文件，获取地址请求第三方接口
     */
    static
    async ExcelReptile(ctx) {
        let catalogue = ctx.request.query.catalogue || ctx.request.body.catalogue;
        let language = ctx.request.headers.language;

        // 使用文件对象打开文件，获取其中内容
        let pars = null;
        try{
            pars = xlsx.parse(catalogue)
        }catch (err) {
            ctx.body = new ErrorModel(400,'文件读取失败，请检查路径',null)
            return;
        }
        // console.log(pars)
        let tokensUrl = [];
        pars[0].data.forEach((item)=>{
            let indexOfs = item[0].indexOf("https://");
            let indexOfId = item[0].indexOf("token/");
            let getUrl = '';
            if(indexOfs && indexOfId){
                getUrl = item[0].slice(indexOfId+6)
                tokensUrl.push(getUrl)
            }
        })
        // console.log(tokensUrl)

        try {
            let data = [];
            let dataID = null;
            for (let i=0;i<tokensUrl.length;i++) {
                dataID = await koaRequest({
                    url: `https://preserver.mytokenpocket.vip/v1/tokenallbyid?id=${tokensUrl[i]}`,
                    method: 'get',
                });
                data.push(JSON.parse(dataID.body).data)
            }
            if(data.length > 0){
                let ExcelData = await TokensModel.ExcelReptile(data,language);
                ctx.body =  ExcelData > 0?new SuccessModel('新增成功',ExcelData):new SuccessModel('无新增数据',ExcelData)
                return;
            }
            ctx.body = new ErrorModel(400,'无法获取您导入的数据',null)

        } catch (err) {
            console.log(err)
            ctx.body = new ErrorModel(500,'服务器访问出错',null)
        }
    }


    /**
     * 读取表格目录文件，获取地址请求第三方接口
     */
    static
    async postExcelReptile(ctx) {
        let catalogue = ctx.request.query.catalogue || ctx.request.body.catalogue;
        let language = ctx.request.headers.language;

        // 使用文件对象打开文件，获取其中内容
        let pars = null;
        try{
            pars = xlsx.parse(catalogue)
        }catch (err) {
            ctx.body = new ErrorModel(400,'文件读取失败，请检查路径',null)
            return;
        }
        if(pars[0].data[0][0] != 'symbol'){
            ctx.body = new ErrorModel(400,'数据格式不正确',null)
            return;
        }else if(pars[0].data[0][1] != 'address'){
            ctx.body = new ErrorModel(400,'数据格式不正确',null)
            return;
        }else if(pars[0].data[0][2] != 'decimal'){
            ctx.body = new ErrorModel(400,'数据格式不正确',null)
            return;
        }else if(pars[0].data[0][3] != 'logo'){
            ctx.body = new ErrorModel(400,'数据格式不正确',null)
            return;
        }else if(pars[0].data[0][4] != 'website'){
            ctx.body = new ErrorModel(400,'数据格式不正确',null)
            return;
        }else if(pars[0].data[0][5] != 'published_on'){
            ctx.body = new ErrorModel(400,'数据格式不正确',null)
            return;
        }else if(pars[0].data[0][6] != 'name'){
            ctx.body = new ErrorModel(400,'数据格式不正确',null)
            return;
        }else if(pars[0].data[0][7] != 'desc'){
            ctx.body = new ErrorModel(400,'数据格式不正确',null)
            return;
        }

        let tokensParams = [];
        let languageParams = [];
        let dataFor = pars[0].data
        // console.log(dataFor)
        // return ;
        for(let i=1;i<dataFor.length;i++){ //删除第一行标题元素再循环
            let token_id = UUID.v4();
            tokensParams.push({
                identifier:token_id,
                symbol:dataFor[i][0],
                address:dataFor[i][1],
                decimals:dataFor[i][2],
                logo:dataFor[i][3],
                website:dataFor[i][4],
                published_on:handleDate(dataFor[i][5], 'yyyy-MM-dd HH:mm:ss'),
                location:'us,cn',
                state:i,
                protocol:20,
                standard_sort:0,
                hot_sort:i+1,
            })
            languageParams.push({
                tokens_id:token_id,
                name:dataFor[i][6],
                desc:dataFor[i][7],
                language:language?language:'zh-cn'
            })
        }
        try {
            let ExcelData = await TokensModel.postExcelReptile(tokensParams,languageParams,language);
            ctx.body =  ExcelData > 0?new SuccessModel('新增成功',ExcelData):new SuccessModel('无新增数据',ExcelData)
        } catch (err) {
            console.log(err)
            ctx.body = new ErrorModel(500,'服务器访问出错',null)
        }
    }
}

module.exports = Tokens
