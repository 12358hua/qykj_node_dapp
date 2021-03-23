const { ErrorModel } = require('./Reslut');
const { isNull } = require('../utils/Regular')

// 转字符串
const Str = function (val) {
    return JSON.stringify(val)
}

// sql判断封装
const sqlContent = function(sqls,location,language,database){
    let limit = 'limit 0,20'
    if(location){
        sqls = sqls + `location=${Str(location)} `
    }
    if(language){
        sqls = sqls + `${location?'and ':''}language=${Str(language)} `
    }

    if(isNull(location) && isNull(language)){
        sqls = `select * from ${database} ` + limit
    }else{
        sqls = sqls + limit
    }
    return sqls;
}

module.exports = {
    Str,
    sqlContent
}
