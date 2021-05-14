const Router = require('koa-router')
const Notice = require('../src/controller/NoticeController')

const Routers = new Router({
    prefix: '/notice' //接口前缀
})

Routers.post('/NoticeInsert', Notice.NoticeInsert);

Routers.get('/noticeList', Notice.NoticeList);

Routers.get('/detail/:id', Notice.noticeDetail);

Routers.get('/getNewDate', Notice.getNewDate);

module.exports = Routers
