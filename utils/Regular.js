//地址验证
const UrlReg = function (url) {
    let urls = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
    if(urls.test(url)){
        return true;
    }
    return false
}

// 只能输入中文、英文和数字
const nameReg = function (name) {
    let names = /[^A-Za-z0-9\u4e00-\u9fa5]/g;
    if(!names.test(name)){
        return true;
    }
    return false
}

// 过滤特殊字符，保留, 、。:;
const desReg = function (des) {
    let dess = /[\\`~!@#$%^&*()+=|{}:;_.<>/?~\-！@#￥%……&*（）——+|{}【】‘；：”“’？\ ]+/g;
    if(!dess.test(des)){
        return true;
    }
    return false
}

// 只能输入数字
const numReg = function (num) {
    let nums = /[^\d]/g;
    if(!nums.test(num)){
        return true;
    }
    return false
}

// 判断是否为空
const isNull = function(val){
    if(val == '' || val == null || val == undefined){
        return true
    }
    return false;
}

// 判断是否为邮箱
const isEmail = function(val){
    let nums = /[^0-9@A-Za-z.]/g;
    if(!nums.test(val)){
        return true;
    }
    return false
}

module.exports = {
    UrlReg,
    nameReg,
    desReg,
    numReg,
    isNull,
    isEmail
}
