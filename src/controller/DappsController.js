const DappsModel = require('../model/DappsModel');
const { SuccessModel, ErrorModel } = require('../../utils/Reslut')

class Dapps {
    /**
     * 获取dapps列表
     * @param ctx
     * @returns dapps列表数据
     */
    static
    async DappsList(ctx) {
        let location = ctx.request.header.location;
        let language = ctx.request.header.language;
        
        try {
            const data = await DappsModel.findAllDappsList(location,language);

            ctx.response.status = 200;
            ctx.body =  new SuccessModel('获取成功',data)
        } catch (err) {
            ctx.response.status = 500;
            ctx.body = new ErrorModel(500,'服务器访问出错',null)
        }
    }
}

module.exports = Dapps