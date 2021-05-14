const NoticeModel = require('../model/NoticeModel');
const { SuccessModel, ErrorModel } = require('../../utils/Reslut');

class Notice {
    static
    async NoticeInsert(ctx){
        let params = ctx.request.body;
        if(!params.title){
            ctx.body =  new SuccessModel(400,'标题不能为空',null)
            return;
        }else if(!params.content){
            ctx.body =  new SuccessModel(400,'内容不能为空',null)
            return;
        }

        try{
            const data = await NoticeModel.NoticeInsert(params);
            if(data.length < 1){
                ctx.body =  new SuccessModel(400,'公告标题已存在',null)
                return;
            }
            ctx.body =  new SuccessModel('操作成功',data)
        }catch (err) {
            console.log(err)
            ctx.body = new ErrorModel(500,'服务器访问出错',null)
        }
    }

    static
    async NoticeList(ctx){
        const {num,size} = ctx.request.query;

        let offset = parseInt(num) || 1; //当前页
        let limit = parseInt(size) || 20; //查询条数
        offset = (offset - 1) * limit; //当前页

        try{
            const data = await NoticeModel.NoticeList(offset,limit);
            ctx.body =  new SuccessModel('查询成功',data)
        }catch (err) {
            console.log(err)
            ctx.body = new ErrorModel(500,'服务器访问出错',null)
        }
    }

    static
    async noticeDetail(ctx){
        const id = ctx.request.url.slice(ctx.request.url.indexOf('detail/')+7);
        if(!id){
            return ctx.body = new ErrorModel(400,'id不能为空',null)
        }

        try{
            const data = await NoticeModel.noticeDetail(id);
            ctx.body =  new SuccessModel('查询成功',data)
        }catch (err) {
            console.log(err)
            ctx.body = new ErrorModel(500,'服务器访问出错',null)
        }
    }

    static
    async getNewDate(ctx){
        try{
            const data = await NoticeModel.getNewDate();
            let newDate = new Date(data[0].createdAt).getTime()
            console.log(newDate)
            // let dateee = new Date(newDate).toJSON();
            // let a = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')

            ctx.body =  new SuccessModel('查询成功',newDate)
        }catch (err) {
            console.log(err)
            ctx.body = new ErrorModel(500,'服务器访问出错',null)
        }
    }

}

module.exports = Notice
