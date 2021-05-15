const NoticeModel = require('../model/NoticeModel');
const { SuccessModel, ErrorModel } = require('../../utils/Reslut');
const secret = require('../../utils/sign.json');
const ethSigUtil = require('eth-sig-util');

class Notice {
    static
    async NoticeInsert(ctx){
        let query = ctx.request.body;
        let bodyData = JSON.parse(query.params)

        if(!bodyData.title){
            ctx.body =  new SuccessModel(400,'标题不能为空',null)
            return;
        }else if(!bodyData.content){
            ctx.body =  new SuccessModel(400,'内容不能为空',null)
            return;
        }else if(!bodyData.sign){
            ctx.body =  new SuccessModel(400,'签名不能为空',null)
            return;
        }

        // 解密后的地址
        const response = ethSigUtil.recoverTypedSignatureLegacy({
            data: bodyData.signContent,
            sig: bodyData.sign
        })

        // 是否是指定的地址
        let address = secret.sign.filter(item=> item.toLowerCase() === response.toLowerCase())

        if(address.length < 1){
            ctx.body =  new SuccessModel(400,'无操作权限',null)
            return;
        }

        try{
            let params = {
                id:bodyData.id,
                title:bodyData.title,
                desc:bodyData.desc,
                content:bodyData.content,
                address:response,
            }
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
            if(data.length > 0){
                let newDate = new Date(data[0].createdAt).getTime();
                ctx.body =  new SuccessModel('查询成功',newDate);
                return;
            }
            // let dateee = new Date(newDate).toJSON();
            // let a = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
            ctx.body =  new SuccessModel('查询成功',0)
        }catch (err) {
            console.log(err)
            ctx.body = new ErrorModel(500,'服务器访问出错',null)
        }
    }

}

module.exports = Notice
