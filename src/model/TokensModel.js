const { Op } = require("sequelize");
const db = require('../../db/db')
const Sequelize = db.sequelize
const seq = require('sequelize');
const TokensBlogSchema = Sequelize.import('../Schema/Tokens/TokensBlogSchema.js')
const TokensBlogLanguageSchema = Sequelize.import('../Schema/Tokens/TokensBlogLanguageSchema.js')
const { isNull } = require('../../utils/Regular')
const UUID = require('uuid')

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
            address:{ //不等于空
                [Op.not]: '',
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
            attributes: ['protocol','symbol', 'address'],
            limit:20,
            where: TokensBlogWhere,
        })

        TokensBlogSchema.belongsTo(TokensBlogLanguageSchema, { //声明主副表关系
            foreignKey: 'identifier',
            targetKey: 'tokens_id',
        });
        if(blpg_data.length > 0){ //如果tokenblog存在，直接再做一次联查
            blpg_data = await TokensBlogSchema.findAll({
                attributes: ['protocol','symbol', 'address', 'decimals', 'logo'],
                limit:20,
                order: [['standard_sort', 'ASC']],
                where: TokensBlogWhere,
                include: [{ //连表查
                    model: TokensBlogLanguageSchema,
                    where: {
                        language: language ? language : 'en'
                    },
                    attributes: ['name']
                }]
            })
            return languageForPush(blpg_data)
        }else{
            blpg_language = await TokensBlogLanguageSchema.findAll({
                attributes: ['name'],
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
                attributes: ['name'],
                limit:20,
                where: languageWhere,
                include: [{ //连表查
                    order: [['standard_sort', 'ASC']],
                    model: TokensBlogSchema,
                    where: {
                        location:{
                            [Op.substring]: location?location:'CN',
                        },
                        address:{ //不等于空
                            [Op.not]: '',
                        },
                    },
                    attributes: ['protocol','symbol', 'address', 'decimals', 'logo'],
                }]
            })
            return languageForPush(blpg_language)
        }
    }

    /**
     * 查询token列表
     * @returns {Promise<*>}
     */
    static async FindTokensList(url,location, language) {
        TokensBlogSchema.belongsTo(TokensBlogLanguageSchema, {
            foreignKey: 'identifier',
            targetKey: 'tokens_id',
        });
        let hot_sorts = {
            hot_sort:{
                [Op.gt]: 0 //大于0
            }
        }
        let standard_sorts = {
            standard_sort:{
                [Op.gt]: 0 //大于0
            }
        }
        hot_sorts.location = {
            [Op.substring]: location?location:'CN',
        };
        standard_sorts.location = {
            [Op.substring]: location?location:'CN',
        };
        console.log(url)

        let where = url == 'hotlist'?hot_sorts:standard_sorts;
        console.log(where)

        let hotlistSort = [['hot_sort','ASC']]; // ASC升序 | DESC降序;
        let standardSort = [['standard_sort', 'ASC']];

        let data = await TokensBlogSchema.findAll({
            attributes: [seq.col('tokens_blog_language.name'),'protocol','symbol', 'address', 'decimals', 'logo'],
            limit: 20,
            order: url == 'standard'?standardSort:hotlistSort,
            where: where,
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
            address:address?address:('' || null),
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
                "protocol": data.dataValues.protocol,
                "symbol": data.dataValues.symbol,
                "address": data.dataValues.address || '',
                "name": data.dataValues.tokens_blog_language.name,
                "decimals": data.dataValues.decimals,
                "logo": data.dataValues.logo,
                "email": data.dataValues.email || '',
                "whitepaper": data.dataValues.whitepaper || '',
                "website": data.dataValues.website || '',
                "state": data.dataValues.state || '',
                "published_on": data.dataValues.published_on || '',
                "desc": data.dataValues.tokens_blog_language.desc || '',
                "links": {
                    "discord": data.dataValues.discord || '',
                    "twitter": data.dataValues.twitter || '',
                    "medium": data.dataValues.medium || ''
                }
            }]
        }
        // console.log(params)

        return params
    }


    /**
     * 批量增加数据
     */
    static async ExcelReptile(req,language) {
        let tokensParams = [];
        let languageParams = [];
        req.forEach((item,index)=>{ //获取数据进行模型的拼接
            let token_id = UUID.v4();
            tokensParams.push({
                identifier:token_id,
                symbol:item.symbol,
                address:item.address,
                decimals:item.decimal,
                logo:item.icon_url,
                website:item.website,
                published_on:dateFormat('YYYY-mm-dd HH:MM',item.create_time),
                location:'us,cn',
                state:index,
                protocol:20,
                standard_sort:0,
                hot_sort:index+1,
            })
            languageParams.push({
                tokens_id:token_id,
                name:item.name,
                desc:item.description,
                language:language?language:'zh-cn'
            })
        })

        return  DetailModel.postExcelReptile(tokensParams,languageParams,language)
    }

    /**
     * 批量增加数据
     */
    static
    async postExcelReptile(tokensParams,languageParams,language) {

        let findAllData = [];
        tokensParams.forEach((item)=>{
            findAllData.push(item.address)
        })
        let tokensParamsFind = await TokensBlogSchema.findAll({
            attributes:['address'],
            where:{
                address:{
                    [Op.in]:findAllData
                }
            }
        })

        //循环语言表
        let languageData = [];
        let languageName = [];
        languageParams.forEach((item)=>{
            languageData.push(language);
            languageName.push(item.name)
        })

        let languageParamsFind = await TokensBlogLanguageSchema.findAll({
            attributes:['name','language','tokens_id'],
            where:{
                name:{
                    [Op.in]:languageName
                }
            }
        })
        console.log(languageParams)

        let tokensParamsForData = blogForOf(tokensParamsFind,tokensParams) //blog表的循环过滤已存在的内容
        let languageParamsForData = languageForOf(languageParamsFind,languageParams,language) //语言表的循环过滤已存在的内容

        // 批量新增
        let TokensBlogReturn = [];
        if(tokensParamsForData.length > 0){
            TokensBlogReturn = await TokensBlogSchema.bulkCreate(tokensParamsForData);
        }
        let TokensLanguageReturn = [];
        if(languageParamsForData.length > 0){
            TokensLanguageReturn = await TokensBlogLanguageSchema.bulkCreate(languageParamsForData);
        }

        return TokensLanguageReturn.length
    }
}

const blogForOf = function (sqlData,pushData) {
    for(let item of sqlData){ //查到的sql
        for (var i = pushData.length - 1; i >= 0; i--) { //过滤的数组
            if(pushData[i].address == item.dataValues.address) {
                pushData.splice(i, 1);
            }
        }
    }
    return pushData;
}

const languageForOf = function (sqlData,pushData,language) {
    for(let item of sqlData){ //查到的sql
        for (var i = pushData.length - 1; i >= 0; i--) { //过滤的数组
            if(pushData[i].name == item.dataValues.name && pushData[i].language == item.dataValues.language) {
                pushData.splice(i, 1);
            }else if(pushData[i].name == item.dataValues.name){
                pushData[i].tokens_id = item.dataValues.tokens_id
            }
        }
    }
    return pushData;
}

const languageForPush = function(data){
    let languages = []
    for(let k=0;k<data.length;k++){
        languages.push({
            protocol:data[k].protocol?data[k].protocol:data[k].tokens_blog.protocol,
            symbol:data[k].symbol?data[k].symbol:data[k].tokens_blog.symbol,
            address:data[k].address?data[k].address:data[k].tokens_blog.address,
            name:data[k].name?data[k].name:data[k].tokens_blog_language.name,
            decimals:data[k].decimals != null?data[k].decimals:data[k].tokens_blog.decimals,
            logo:data[k].logo?data[k].logo:data[k].tokens_blog.logo,
        })
    }
    return languages
}

const dateFormat = function(fmt, date) {
    let ret="";
    date=new Date(date);
    const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString() // 秒
    }
    for (let k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
            fmt = fmt.replace(
                ret[1],
                ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
            )
        }
    }
    return fmt
}

module.exports = DetailModel
