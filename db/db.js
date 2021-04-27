const Sequelize = require('sequelize');

/**
 *
 * 配置数据库
 *
 * 第一个参数 boblog    数据库名字
 * 第二个参数 root      数据库名字
 * 第三个参数 password  数据库密码
 */
// console.log(process.argv.splice(2)+' 获取到项目启动的参数，从第二个开始就是dev后面的参数')
var data = process.argv.splice(2)
console.log(data)
// 121.43.131.180  localhost
// data[1], data[2], data[3],data[4]  BoundaryNetwork
// npm run dev 3009 159.138.48.192 HuobiEcoChainMainNet root 12358Hua
// npm run dev 3008 121.43.131.180 EthereumMainNet root 12345
// npm run dev 3010 182.160.7.106 halodatabase root lJHSi*P*yk@DF7Sm
// 159.138.48.192 //服务器ip
// 121.43.131.180
// 182.160.7.106 数据库ip
// 47.243.110.253
// npm run dev 3009 rm-j6ci5c424a601sfn7ro.mysql.rds.aliyuncs.com gctdatabase gct_admin jMgXX9R1AzEpIu3Z
const sequelize = new Sequelize(data[2], data[3], data[4], {
    host: data[1],
    dialect: 'mysql',
    operatorsAliases: 0, //0为false,1为true，否则会弹出警告
    dialectOptions: {
        charset: "utf8",
        collate: "utf8_general_ci",
        supportBigNumbers: 1,
        bigNumberStrings: 1
    },

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    timezone: '+08:00' //东八时区
});

module.exports = {
    sequelize
}
