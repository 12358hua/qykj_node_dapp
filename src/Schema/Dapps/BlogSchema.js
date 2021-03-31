const moment = require('moment');
const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('dapps_blog', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV1, // 或 Sequelize.UUIDV1
            allowNull: false, //将 allowNull 设置为 false 将为该列添加 NOT NULL
            // primaryKey: true
        },
        category_id: {
            type: DataTypes.TEXT,
            field: 'category_id',
            comment:'关联分类id',
        },
        identifier: {
            type: DataTypes.STRING(255),
            field: 'identifier',
            allowNull: false,
            unique:true,
            comment:'语言Id',
            primaryKey: true
        },
        url: {
            type: DataTypes.STRING(255),
            field: 'url',
            comment:'url地址'
        },
        logo: {
            type: DataTypes.STRING(255),
            field: 'logo',
            comment:'logo地址'
        },
        sort: {
            type: DataTypes.INTEGER,
            field: 'sort', //你可以通过 'field' 属性指定自定义列名称
            comment:'(不自增，可做普通排序使用)'
        },
        hot: {
            type: DataTypes.INTEGER,
            field: 'hot',
            comment:'热门排序'
        },
        isIndex: {
            type: DataTypes.INTEGER,
            field: 'isIndex',
            comment:'是否热门'
        },
        location: {
            type: DataTypes.TEXT,
            field: 'location',
            comment:'地区  为null是所有地区 （数据格式：‘地区1，地区2’）'
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
        freezeTableName: true
    })
}
