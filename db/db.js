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
// npm run dev 3008 node-dappsql root 12345
// 121.43.131.180  localhost

const sequelize = new Sequelize(data[1], data[2], data[3], {
    host: '121.43.131.180',
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
