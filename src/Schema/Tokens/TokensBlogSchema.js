const Sequelize = require('sequelize');
const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tokens_blog', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV1, // 或 Sequelize.UUIDV1
            allowNull: false, //将 allowNull 设置为 false 将为该列添加 NOT NULL
            primaryKey: true, //true继续阅读有关主键的更多信息
        },
        identifier:{
            type: DataTypes.STRING(128),
            field: 'identifier', //你可以通过 'field' 属性指定自定义列名称
            unique: true,
            allowNull: false,
            comment:'关联语言id',
        },
        standard_sort:{
            type: DataTypes.INTEGER,
            field: 'standard_sort',
            comment:' (可做普通排序使用)',
        },
        hot_sort:{
            type: DataTypes.INTEGER,
            field: 'hot_sort',
            comment:' 是否热门 (null：否，大于等于0: 是)',
        },
        symbol: {
            type: DataTypes.STRING(60),
            field: 'symbol', //你可以通过 'field' 属性指定自定义列名称
            comment:'代币',
        },
        address: {
            type: DataTypes.STRING(255),
            field: 'address',
            comment:'代币地址'
        },
        decimals: {
            type: DataTypes.INTEGER,
            field: 'decimals',
            comment:'代币数'
        },
        logo: {
            type: DataTypes.STRING(255),
            field: 'logo', //你可以通过 'field' 属性指定自定义列名称
            comment:'logo图片'
        },
        email: {
            type: DataTypes.STRING(128),
            field: 'email',
            comment:'邮箱'
        },
        whitepaper:{
            type: DataTypes.STRING(600),
            field: 'whitepaper',
        },
        website: {
            type: DataTypes.STRING(600),
            field: 'website',
            comment:'网站'
        },
        state: {
            type: DataTypes.STRING(255),
            field: 'state',
            comment:'声明'
        },
        published_on: {
            type: DataTypes.STRING(255),
            field: 'published_on',
            comment:'发布时间'
        },
        discord: {
            type: DataTypes.STRING(255),
            field: 'discord',
        },
        twitter: {
            type: DataTypes.STRING(255),
            field: 'twitter',
        },
        medium: {
            type: DataTypes.STRING(255),
            field: 'medium',
        },
        location: {
            type: DataTypes.TEXT,
            field: 'location',
            comment:'地区'
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
