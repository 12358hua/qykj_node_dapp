const { Op } = require("sequelize");
const db = require('../../db/db')
const Sequelize = db.sequelize
const DetailSchema = Sequelize.import('../Schema/Tokens/DetailSchema.js')
const { isNull } = require('../../utils/Regular')

class DetailModel{
    /**
     * 查询search列表
     * @returns {Promise<*>}
     */
     static async FindSearchDetailList(keyword,location,language) {

        let isAnLo = [
            { location: location?location:'' },
            { language: language?language:'' },
        ]

        let IsKeyword = [
            isAnLo[0],
            isAnLo[1],
            { language: language?language:'' },
            {symbol: { [Op.like]:'%' +keyword + '%' }},
            {name: { [Op.like]:'%' +keyword + '%'}},
            {address: { [Op.like]:'%' +keyword + '%' }}
        ]

        let where = {
            [Op.or]: keyword?IsKeyword:isAnLo,
        }

        let data = await DetailSchema.findAll({
            attributes: ['symbol', 'address','name', 'decimals','logo'],
            limit : 20,
            where:(keyword || location || language)?where:{}
        })

        return data
    }


    /**
     * 查询detail详情
     * @returns {Promise<*>}
     */
     static async FindDetail(address,location,language) {

        let data = await DetailSchema.findAll({
            attributes: {exclude: ['id','createdAt','updatedAt']},
            // attributes: ['symbol', 'address','name', 'decimals','logo'],
            where:{
                location: location?location:'',
                language: language?language:'',
                address: address?address:''
            }
        })

        let datas = []
        for(let i=0;i<data.length;i++){
            datas.push({
                "symbol": data[i].symbol,
                "address": data[i].address,
                "name": data[i].name,
                "decimals": data[i].decimals,
                "logo": data[i].logo,
                "overview": {
                    "en": data[i].en,
                    "zh": data[i].zh
                },
                "email": data[i].email,
                "whitepaper": data[i].whitepaper,
                "website": data[i].website,
                "state": data[i].state,
                "published_on": data[i].published_on,
                "links": {
                    "discord": data[i].discord,
                    "twitter": data[i].twitter,
                    "medium": data[i].medium
                }
            })
        }

        return datas
    }
}

module.exports = DetailModel
