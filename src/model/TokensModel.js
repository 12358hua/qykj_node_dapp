const { Op } = require("sequelize");
const db = require('../../db/db')
const Sequelize = db.sequelize
const seq = require('sequelize');
const TokensBlogSchema = Sequelize.import('../Schema/Tokens/TokensBlogSchema.js')
const TokensBlogLanguageSchema = Sequelize.import('../Schema/Tokens/TokensBlogLanguageSchema.js')
const { isNull } = require('../../utils/Regular')

// TokensBlogSchema.sync();
// TokensBlogLanguageSchema.sync();

class DetailModel {

    /**
     * 修改状态是否为热门
     * @returns {Promise<*>}
     */
    static async TokensUpdateIsIndex(id,hotSort) {
        return await TokensBlogSchema.update({hot_sort:hotSort},{where: { id:id }});
    }

    /**
     * 查询search关键字列表
    * */
    static async FindTokenKeyword(keyword,location,language){
        let TokensBlogWhere = { //tokenblog查询条件location必须或默认，关键字or
            location:{
                [Op.substring]: location?location:'CN',
            },
            [Op.or]: [
                {symbol: { [Op.like]:'%' + keyword + '%' }},
                {address: { [Op.like]:'%' + keyword + '%' }}
            ]
        }
        let languageWhere = { //语言条件and
            [Op.and]: [
                {name: {[Op.like]: `%${keyword}%`}},
                {language: language ? language : 'en'},
            ]
        }

        let blpg_language = []//语言language
        let blpg_data = await TokensBlogSchema.findAll({ //先查一次tokenBlog
            attributes: ['symbol', 'address'],
            limit:20,
            where: TokensBlogWhere,
        })

        TokensBlogSchema.belongsTo(TokensBlogLanguageSchema, { //声明主副表关系
            foreignKey: 'identifier',
            targetKey: 'tokens_id',
        });
        if(blpg_data.length > 0){ //如果tokenblog存在，直接再做一次联查
            blpg_data = await TokensBlogSchema.findAll({
                attributes: ['id','symbol', 'address', 'decimals', 'logo'],
                limit:20,
                order: [['standard_sort', 'ASC']],
                where: TokensBlogWhere,
                include: [{ //连表查
                    model: TokensBlogLanguageSchema,
                    where: {
                        language: language ? language : 'en'
                    },
                    attributes: ['name','desc']
                }]
            })
            return languageForPush(blpg_data)
        }else{
            blpg_language = await TokensBlogLanguageSchema.findAll({
                attributes: ['name','desc'],
                limit:20,
                where: languageWhere,
            })
            if(blpg_language.length < 1){ //如果tokenblog不存在则查对应language语言
                return []
            }
            //如果存在，主副表反过来再查一遍（没反过来之前主表是一对多关系，这样查是不可行的，不过在查询的时候，副表给了指定条件只查当前语言，所以查出来的结果也会是一对一的关系，是可行的，因为暂时没有找到更好的解决方案，所以先这样处理）
            TokensBlogLanguageSchema.belongsTo(TokensBlogSchema, {
                foreignKey: 'tokens_id',
                targetKey: 'identifier',
            });
            blpg_language = await TokensBlogLanguageSchema.findAll({
                attributes: ['name','desc'],
                limit:20,
                where: languageWhere,
                include: [{ //连表查
                    order: [['standard_sort', 'ASC']],
                    model: TokensBlogSchema,
                    where: {
                        location:{
                            [Op.substring]: location?location:'CN',
                        }
                    },
                    attributes: ['id','symbol', 'address', 'decimals', 'logo'],
                }]
            })
            return languageForPush(blpg_language)
        }
    }

    /**
     * 查询token列表
     * @returns {Promise<*>}
     */
    static async FindTokensList(hot, location, language) {

        TokensBlogSchema.belongsTo(TokensBlogLanguageSchema, {
            foreignKey: 'identifier',
            targetKey: 'tokens_id',
        });
        // console.log(hot)
        let where = {
            location:{
                [Op.substring]: location?location:'CN',
            },
            hot_sort:{
                [Op.gte]: typeof hot == 'string'?parseInt(hot):hot//大于0
            }
        }

        let data = await TokensBlogSchema.findAll({
            attributes: [seq.col('tokens_blog_language.name'),seq.col('tokens_blog_language.desc'),'id','symbol', 'address', 'hot_sort','decimals', 'logo'],
            limit: 20,
            order: [
                ['standard_sort', 'ASC'], // ASC升序 | DESC降序;
            ],
            where: hot?where:{
                location:{
                    [Op.substring]: location?location:'CN',
                }
            },
            include: [{ //连表查
                model: TokensBlogLanguageSchema,
                where: {language: language?language:'en'},
                attributes: ['name']
            }],
            raw: true
        })

        data.forEach((item)=>{
            delete item['tokens_blog_language.name']
        })

        return data
    }


    /**
     * 查询detail详情
     * @returns {Promise<*>}
     */
    static async FindTokensDetail(address, location, language) {
        console.log(address, location, language)

        let isLocation = {
            address:address,
            location:{
                [Op.substring]: location?location:'CN',
            }
        }
        TokensBlogSchema.belongsTo(TokensBlogLanguageSchema, {
            foreignKey: 'identifier',
            targetKey: 'tokens_id',
        });

        let data = await TokensBlogSchema.findOne({
            attributes: {exclude: ['id', 'identifier','standard_sort','location','hot_sort','createdAt', 'updatedAt']},
            where:location?isLocation:{
                address:address,
            },
            include: [{ //连表查
                model: TokensBlogLanguageSchema,
                where: {
                    language: language?language:'en'
                },
                attributes: ['name','desc']
            }],
        })
        let params = null
        if(data != null){
            params = [{
                "symbol": data.dataValues.symbol,
                "address": data.dataValues.address,
                "name": data.dataValues.tokens_blog_language.name,
                "decimals": data.dataValues.decimals,
                "logo": data.dataValues.logo,
                "email": data.dataValues.email,
                "whitepaper": data.dataValues.whitepaper,
                "website": data.dataValues.website,
                "state": data.dataValues.state,
                "published_on": data.dataValues.published_on,
                "links": {
                    "discord": data.dataValues.discord,
                    "twitter": data.dataValues.twitter,
                    "medium": data.dataValues.medium
                }
            }]

            // data.dataValues.name = data.dataValues.tokens_blog_language.name;
            // data.dataValues.desc = data.dataValues.tokens_blog_language.desc;
            // delete data.dataValues.tokens_blog_language;
            // data.dataValues.overview = {
            //     "en": '1232',
            //     "zh": '中午'
            // }
            // data.dataValues.links = {
            //     discord:data.dataValues.discord,
            //     twitter:data.dataValues.twitter,
            //     medium:data.dataValues.medium,
            // }
            // delete data.dataValues.desc;
            // delete data.dataValues.discord;
            // delete data.dataValues.twitter;
            // delete data.dataValues.medium;
        }
        console.log(params)

        return params
    }
}

const languageForPush = function(data){
    let languages = []
    for(let k=0;k<data.length;k++){
        languages.push({
            id:data[k].id?data[k].id:data[k].tokens_blog.id,
            symbol:data[k].symbol?data[k].symbol:data[k].tokens_blog.symbol,
            address:data[k].address?data[k].address:data[k].tokens_blog.address,
            name:data[k].name?data[k].name:data[k].tokens_blog_language.name,
            desc:data[k].desc?data[k].desc:data[k].tokens_blog_language.desc,
            decimals:data[k].decimals?data[k].decimals:data[k].tokens_blog.decimals,
            logo:data[k].logo?data[k].logo:data[k].tokens_blog.logo,
        })
    }
    return languages
}

module.exports = DetailModel
