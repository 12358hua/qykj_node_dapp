const { Op } = require("sequelize");
const db = require('../../db/db')
const Sequelize = db.sequelize
const TypeImSchema = Sequelize.import('../Schema/Dapps/TypeImSchema.js')
const BannerSchema = Sequelize.import('../Schema/Dapps/BannerSchema.js')
const CategorySchema = Sequelize.import('../Schema/Dapps/CategorySchema.js')
const { isNull } = require('../../utils/Regular')

// TypeImSchema.sync({force: false});
// BannerSchema.sync({force: false});
// CategorySchema.sync({force: false});

class DappsModel{
    /**
     * 查询dapps列表
     * @returns {Promise<*>}
     */
     static async findAllDappsList(location,language) {

        let BannerData = await BannerSchema.findAll({
            attributes: ['image', 'url'],
            where: (location || language)? {
                [Op.or]: [
                    { location: location?location:'' },
                    { language: language?language:'' }
                ]    
            }:''
        })

        let CategoryData = await CategorySchema.findAll({
            attributes: ['type', 'category_id'],
            where: (location || language)? {
                [Op.or]: [
                    { location: location?location:'' },
                    { language: language?language:'' }
                ]    
            }:''
        })

        let itemData = []
        if(CategoryData.length >= 1){
            for(let i = 0;i<CategoryData.length;i++){
                console.log(CategoryData[i].category_id,i)

                let dataItem = await TypeImSchema.findAll({
                    attributes: ['name', 'url','des','logo'],
                    where: { category_id: CategoryData[i].category_id }
                })

                itemData.push({
                    type:CategoryData[i].type,
                    items:dataItem
                })
            }
        }

        let data = {
            banners:BannerData,
            dapps:itemData
        }

        return data
    }
}

module.exports = DappsModel