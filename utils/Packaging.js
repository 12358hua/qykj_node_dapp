const { ErrorModel } = require('./Reslut');
const { isNull } = require('../utils/Regular')

// 转字符串
const Str = function (val) {
    return JSON.stringify(val)
}

module.exports = {
    Str
}
