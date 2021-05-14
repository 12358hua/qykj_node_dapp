const { Op } = require("sequelize");
const seq = require("sequelize");
const db = require('../../db/db')
const Sequelize = db.sequelize

const NoticeSchema = Sequelize.import('../Schema/Notice/NoticeSchema.js')
const { isNull } = require('../../utils/Regular')

// NoticeSchema.sync({force: true});
// NoticeUserSchema.sync({force: true});

class NoticeModel{
    static async NoticeInsert(params){
        console.log(params)
        let findTitle = await NoticeSchema.findOne({
            where:{
                title:params.title
            }
        })
        if(findTitle != null){
            return []
        }

        return await NoticeSchema.create(params)
    }


    static async NoticeList(offset,limit) {
        return await NoticeSchema.findAndCountAll({
            offset:offset,
            limit:limit,
            order: [['sort', 'DESC']],
        })
    }

    static async noticeDetail(id) {
        return await NoticeSchema.findOne({
            where:{
                id:id
            }
        })
    }

    static async getNewDate() {
        return await NoticeSchema.findAll({
            limit:1,
            order: [['sort', 'DESC']], //ASC
        })
    }
}

module.exports = NoticeModel
