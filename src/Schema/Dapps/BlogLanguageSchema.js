const moment = require('moment');
const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('dapps_blog_language', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV1, // 或 Sequelize.UUIDV1
            allowNull: false, //将 allowNull 设置为 false 将为该列添加 NOT NULL
            primaryKey: true,
        },
        blog_id: {
            type: DataTypes.STRING(255),
            field: 'blog_id',
            allowNull: false, //将 allowNull 设置为 false 将为该列添加 NOT NULL
            comment:'关联blog',
            // unique : true,
            // primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            field: 'name', //你可以通过 'field' 属性指定自定义列名称
        },
        des: {
            type: DataTypes.TEXT,
            field: 'des', //你可以通过 'field' 属性指定自定义列名称
        },
        language_code: {
            type: DataTypes.STRING(128),
            field: 'language_code',
            comment:'（指定语言）'
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
