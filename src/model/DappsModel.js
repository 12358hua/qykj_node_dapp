const { Op } = require("sequelize");
const seq = require("sequelize");
const db = require('../../db/db')
const Sequelize = db.sequelize

const BannerSchema = Sequelize.import('../Schema/Dapps/BannerSchema.js')

const BlogSchema = Sequelize.import('../Schema/Dapps/BlogSchema.js')
const BlogLanguageSchema = Sequelize.import('../Schema/Dapps/BlogLanguageSchema.js')
const CategoryLanguageSchema = Sequelize.import('../Schema/Dapps/CategoryLanguageSchema.js')
const DappsCategorySchema = Sequelize.import('../Schema/Dapps/DappsCategorySchema.js')
const { isNull } = require('../../utils/Regular')

// BannerSchema.sync({force: true});
// BlogLanguageSchema.sync({force: true});
// CategoryLanguageSchema.sync({force: true});
// DappsCategorySchema.sync({force: true});
// BlogSchema.sync({force: true});

class DappsModel{
    /**
     * 获取dapps热门
     * @returns {Promise<*>}
     */
    static async DappHotlist(location,language) {
        BlogSchema.belongsTo(BlogLanguageSchema, {foreignKey: 'identifier', targetKey: 'blog_id' });

        // console.log([CategoryData[i].id])
        let data = await BlogSchema.findAll({
            attributes: [seq.col('dapps_blog_language.name'),seq.col('dapps_blog_language.des'),'url','logo'],
            order: [['sort', 'ASC']],
            where: {
                location:{
                    [Op.substring]: location?location:'CN',
                },
                isIndex:{
                    [Op.gt]:0 //大于0
                }
            },
            limit:6,
            include: [{ //连表查
                model: BlogLanguageSchema,
                where: {
                    language_code: language?language:'en'
                },
                attributes: ['name']
            }],
            raw:true
        })

        data.forEach((item)=>{
            delete item['dapps_blog_language.name']
        })

        return data
    }

    /**
     * 修改状态是否为热门
     * @returns {Promise<*>}
     */
    static async DappsUpdateIsIndex(id,isIndex) {
        return await BlogSchema.update({isIndex:isIndex},{where: { id:id }});
    }

    /**
     * 搜索查询dapps列表
     * @returns {Promise<*>}
     */
    static async DappsSearchList(keyword,isIndex,location,language) {

        let where1 = {
            language_code:language?language:'en',
        }
        let where2 = {
            language_code:language?language:'en',
            name:{[Op.like]:'%' + keyword + '%'}
        }

        BlogLanguageSchema.belongsTo(BlogSchema, {
            foreignKey: 'blog_id',
            targetKey: 'identifier',
        });
        let blpg_language = await BlogLanguageSchema.findAll({
            attributes: [seq.col('dapps_blog.id'),seq.col('dapps_blog.url'),seq.col('dapps_blog.logo'),seq.col('dapps_blog.isIndex'),'name','des'],
            limit:20,
            where: keyword?where2:where1,
            include: [{ //连表查
                order: [['sort', 'ASC']],
                model: BlogSchema,
                where: {
                    location:{
                        [Op.substring]: location?location:'CN',
                    }
                },
                attributes: ['id'],
            }],
            raw: true
        })

        blpg_language.map((item)=>{
            delete item['dapps_blog.id']
        })

        return blpg_language
    }


    /**
     * 查询dapps列表
     * @returns {Promise<*>}
     */
     static async findAllDappsList(location,language) {

         //查轮播图
        let BannerData = await BannerSchema.findAll({
            attributes: ['image', 'url'],
            where: (location || language)? {
                [Op.or]: [
                    { location: location?location:'zh-cn' },
                    { language: language?language:'zh-cn' }
                ]
            }:{}
        })

        DappsCategorySchema.belongsTo(CategoryLanguageSchema, {foreignKey: 'identifier', targetKey: 'category_id' });
        let CategoryData = await DappsCategorySchema.findAll({
            where: location?{ //查国家
                isIndex:1,
                [Op.or]:{
                    location:{
                        [Op.substring]: location,
                    }
                }
            }:{isIndex:1},
            order: [
                ['sort', 'ASC'], // ASC升序 | DESC降序;
            ],
            attributes: ['id'], //过滤字段{exclude: ['createdAt', 'updatedAt']}
            include: [{ //连表查
                model: CategoryLanguageSchema,
                where: {
                    language: language?language:'en'
                },
                attributes: ['type']
            }]
        })
        console.log(CategoryData.length)

        let itemData = []

        BlogSchema.belongsTo(BlogLanguageSchema, {foreignKey: 'identifier', targetKey: 'blog_id' });
        if(CategoryData.length >= 1){
            for(let i = 0;i<CategoryData.length;i++){
                // console.log([CategoryData[i].id])
                let dataItem = await BlogSchema.findAll({
                    attributes: ['url','logo'],
                    order: [
                        ['sort', 'ASC'], // ASC升序 | DESC降序;
                    ],
                    where: {
                        category_id:{
                            [Op.like]: `%${CategoryData[i].id}`,
                        },
                        isIndex:{
                            [Op.gt]:0 //大于0
                        }
                    },
                    limit:8,
                    include: [{ //连表查
                        model: BlogLanguageSchema,
                        where: {
                            language_code: language?language:'en'
                        },
                        attributes: ['name','des']
                    }]
                })

                let blog = []
                // console.log(dataItem)
                for(let k=0;k<dataItem.length;k++){
                    blog.push({
                        name:dataItem[k].dapps_blog_language.name,
                        des:dataItem[k].dapps_blog_language.des,
                        url:dataItem[k].url,
                        logo:dataItem[k].logo
                    })
                }

                itemData.push({
                    type:CategoryData[i].dapps_category_language.type,
                    items:blog
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
