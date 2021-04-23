const Sequelize = require('sequelize');
const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tokens_blog_language', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV1, // 或 Sequelize.UUIDV1
            unique: true,
            allowNull: false, //将 allowNull 设置为 false 将为该列添加 NOT NULL
            primaryKey: true, //true继续阅读有关主键的更多信息
        },
        tokens_id: {
            type: DataTypes.STRING(128),
            field: 'tokens_id', //你可以通过 'field' 属性指定自定义列名称
            comment:'关联token id',
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            field: 'name', //你可以通过 'field' 属性指定自定义列名称
            unique: true,
            primaryKey: true, //true继续阅读有关主键的更多信息
            comment:'名称语言',
        },
        desc: {
            type: DataTypes.TEXT,
            field: 'desc',
            comment:'简介语言',
        },
        language:{
            type: DataTypes.STRING(60),
            field: 'language',
            comment:'语言类型',
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'create_time',
            allowNull: false,
            defaultValue:Sequelize.NOW,
            get() {
                return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        updatedAt: {
            field: 'update_time',
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('update_time')).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    }, {
        // 如果为 true 则表的名称和 model 相同，即 user
        // 为 false MySQL创建的表名称会是复数 users
        // 如果指定的表名称本就是复数形式则不变
        freezeTableName: true
    })
}
