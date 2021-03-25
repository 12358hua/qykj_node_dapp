const DetailModel = require('../model/DetailModel');
const { SuccessModel, ErrorModel } = require('../../utils/Reslut');
const { isNull } = require('../../utils/Regular');

class Detail {
    /**
     * 获取detail列表
     * @param ctx
     * @returns detail列表数据
     */
    static
    async DetailSearch(ctx) {
        let keyword = ctx.request.query.keyword;
        let location = ctx.request.header.location;
        let language = ctx.request.header.language;

        if(ctx.request.url.indexOf('/tokens/search') >= 0){
            if(isNull(keyword)){
                ctx.body = new ErrorModel(400,'缺少keyword字段值',null)
                return;
            }
        }

        try {
            const data = await DetailModel.FindSearchDetailList(keyword,location,language);

            ctx.response.status = 200;
            ctx.body =  new SuccessModel('获取成功',data)
        } catch (err) {
            ctx.response.status = 500;
            ctx.body = new ErrorModel(500,'服务器访问出错',null)
        }
    }

     /**
     * 获取detail
     * @param ctx
     * @returns detail数据
     */
      static
      async DetailAddress(ctx) {
          let address = ctx.request.query.address;
          let location = ctx.request.header.location;
          let language = ctx.request.header.language;

          if(isNull(address)){
            ctx.body = new ErrorModel(400,'缺少address字段值',null)
          }

          try {
              const data = await DetailModel.FindDetail(address,location,language);
              ctx.response.status = 200;
              ctx.body =  new SuccessModel('获取成功',data)
          } catch (err) {
              ctx.response.status = 500;
              ctx.body = new ErrorModel(500,'服务器访问出错',null)
          }
      }
}

module.exports = Detail
