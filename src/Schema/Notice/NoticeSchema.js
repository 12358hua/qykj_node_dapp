const moment = require('moment');
const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('notice', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV1, // 或 Sequelize.UUIDV1
            primaryKey: true, //true继续阅读有关主键的更多信息
        },
        title: {
            type: DataTypes.STRING(255),
            field: 'title', //你可以通过 'field' 属性指定自定义列名称
            allowNull: false
        },
        desc: {
            type: DataTypes.STRING(255),
            field: 'desc',
        },
        content: {
            type: DataTypes.TEXT,
            field: 'content',
            allowNull: false
        },
        sort:{
            type: DataTypes.INTEGER,
            field: 'sort',
        },
        create_date: {
            type: DataTypes.DATE,
            field: 'create_date',
            allowNull: false,
            defaultValue:Sequelize.NOW,
            get() {
                return moment(this.getDataValue('create_date')).format('YYYY-MM-DD');
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'create_time',
            allowNull: false,
            defaultValue:Sequelize.NOW,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        updatedAt: {
            field: 'update_time',
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    }, {
        // 如果为 true 则表的名称和 model 相同，即 user
        // 为 false MySQL创建的表名称会是复数 users
        // 如果指定的表名称本就是复数形式则不变
        freezeTableName: true
    })
}
