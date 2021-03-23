const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('banners', {
        id: {
            type: DataTypes.UUID,
            defaultValue: sequelize.UUIDV1, // 或 Sequelize.UUIDV1
            primaryKey: true, //true继续阅读有关主键的更多信息
        },
        image: {
            type: DataTypes.STRING(255),
            field: 'image', //你可以通过 'field' 属性指定自定义列名称
            allowNull: false
        },
        url: {
            type: DataTypes.STRING(255),
            field: 'url',
            allowNull: false
        },
        location: {
            type: DataTypes.STRING(128),
            field: 'location',
            allowNull: false
        },
        language: {
            type: DataTypes.STRING(128),
            field: 'language',
            allowNull: false
        }
    }, {
        // 如果为 true 则表的名称和 model 相同，即 user
        // 为 false MySQL创建的表名称会是复数 users
        // 如果指定的表名称本就是复数形式则不变
        freezeTableName: true
    })
}
