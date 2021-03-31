const moment = require('moment');
const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('dapps_category', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV1, // 或 Sequelize.UUIDV1
            allowNull: false, //将 allowNull 设置为 false 将为该列添加 NOT NULL
            primaryKey: true
        },
        identifier: {
            type: DataTypes.STRING(255),
            field: 'identifier',
            allowNull: false,
            // references: {
            //     model: 'dapps_category_language',
            //     key: 'category_id'
            // },
            comment:'语言Id'
        },
        sort: {
            type: DataTypes.INTEGER,
            field: 'sort', //你可以通过 'field' 属性指定自定义列名称
            comment:'自增 (可做普通排序使用)',
        },
        isIndex: {
            type: DataTypes.INTEGER,
            field: 'isIndex',
            comment:'是否热门 (null：否，大于等于0: 是)'
        },
        location: {
            type: DataTypes.STRING(3000),
            field: 'location',
            comment:'地区  为null是所有地区（数据格式：‘地区1，地区2’）'
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
