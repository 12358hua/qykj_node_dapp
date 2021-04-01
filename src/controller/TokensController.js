const TokensModel = require('../model/TokensModel');
const { SuccessModel, ErrorModel } = require('../../utils/Reslut');
const { isNull } = require('../../utils/Regular');

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

          if(isNull(address)){
               ctx.body = new ErrorModel(400,'缺少address字段值',null)
               return;
          }

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
}

module.exports = Tokens
