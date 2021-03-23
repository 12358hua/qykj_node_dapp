const Sequelize = require('sequelize');

/**
 *
 * 配置数据库
 *
 * 第一个参数 boblog    数据库名字
 * 第二个参数 root      数据库名字
 * 第三个参数 password  数据库密码
 */
const sequelize = new Sequelize('node-dappsql', 'root', '12358Hua', {
    host: 'localhost',
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
