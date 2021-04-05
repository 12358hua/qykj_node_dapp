const DappsModel = require('../model/DappsModel');
const { SuccessModel, ErrorModel } = require('../../utils/Reslut')

class Dapps {
    static
    async DappHotlist(ctx){
        let location = ctx.request.header.location;
        let language = ctx.request.header.language;

        try {
            const data = await DappsModel.DappHotlist(location,language);
            ctx.body =  new SuccessModel('获取成功',data)
        } catch (err) {
            console.log(err)
            ctx.body = new ErrorModel(500,'服务器访问出错',null)
        }
    }


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
            ctx.body =  new SuccessModel('获取成功',data)
        } catch (err) {
            ctx.body = new ErrorModel(500,'服务器访问出错',null)
        }
    }

    /**
     * 修改状态是否为热门
     * @param ctx
     */
    static
    async DappsUpdateIsIndex(ctx) {
        let isIndex = ctx.request.query.isIndex;
        let id = ctx.request.query.id;
        if(!isIndex || !id){
            ctx.body = new ErrorModel(400,'缺少字段值',null)
            return;
        }

        try {
            const data = await DappsModel.DappsUpdateIsIndex(id,isIndex);
            console.log(data)
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
     * get
     * 搜索获取dapps列表
     * @param ctx
     * @returns dapps列表数据
     */
    static
    async DappsSearchList(ctx) {
        let location = ctx.request.header.location;
        let language = ctx.request.header.language;
        let keyword = ctx.request.query.keyword;
        let isIndex = ctx.request.query.isIndex;

        try {
            if(!keyword){
                ctx.body = new ErrorModel(401,'暂无数据',[])
                return;
            }
            const data = await DappsModel.DappsSearchList(keyword,isIndex,location,language);
            if(data == null || data.length < 1){
                ctx.body = new ErrorModel(401,'暂无数据',[])
                return;
            }
            ctx.body =  new SuccessModel('获取成功',data)
        } catch (err) {
            console.log(err)
            ctx.body = new ErrorModel(500,'服务器访问出错',null)
        }
    }
}

module.exports = Dapps
