const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('dapps_type_list', {
        id: {
            type: DataTypes.UUID,
            defaultValue: sequelize.UUIDV1, // 或 Sequelize.UUIDV1
            // allowNull: false, //将 allowNull 设置为 false 将为该列添加 NOT NULL
            primaryKey: true, //true继续阅读有关主键的更多信息
            // autoIncrement: true //autoIncrement 可用于创建 auto_incrementing 整数列
        },
        category_id: {
            type: DataTypes.STRING(128),
            field: 'category_id', //你可以通过 'field' 属性指定自定义列名称
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(255),
            field: 'name',
            allowNull: false
        },
        url: {
            type: DataTypes.STRING(255),
            field: 'url',
            allowNull: false
        },
        des: {
            type: DataTypes.TEXT,
            field: 'des',
            allowNull: false,
        },
        logo: {
            type: DataTypes.STRING(600),
            field: 'logo',
            allowNull: false
        },
        isIndex: {
            type: DataTypes.INTEGER,
            field: 'isIndex',
            allowNull: false,
        }
    }, {
        // 如果为 true 则表的名称和 model 相同，即 user
        // 为 false MySQL创建的表名称会是复数 users
        // 如果指定的表名称本就是复数形式则不变
        freezeTableName: true
    })
}
