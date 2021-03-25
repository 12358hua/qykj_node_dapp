module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tokens', {
        id: {
            type: DataTypes.UUID,
            defaultValue: sequelize.UUIDV1, // 或 Sequelize.UUIDV1
            // allowNull: false, //将 allowNull 设置为 false 将为该列添加 NOT NULL
            primaryKey: true, //true继续阅读有关主键的更多信息
            // autoIncrement: true //autoIncrement 可用于创建 auto_incrementing 整数列
        },
        symbol: {
            type: DataTypes.STRING(60),
            field: 'symbol', //你可以通过 'field' 属性指定自定义列名称
            allowNull: false
        },
        address: {
            type: DataTypes.STRING(128),
            field: 'address',
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(128),
            field: 'name',
            allowNull: false
        },
        decimals: {
            type: DataTypes.INTEGER,
            field: 'decimals',
            allowNull: false,
        },
        logo: {
            type: DataTypes.STRING(1000),
            field: 'logo', //你可以通过 'field' 属性指定自定义列名称
            allowNull: false
        },
        en: {
            type: DataTypes.TEXT,
            field: 'en',
            allowNull: false
        },
        zh: {
            type: DataTypes.TEXT,
            field: 'zh',
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(128),
            field: 'email',
            allowNull: false,
        },
        whitepaper:{
            type: DataTypes.STRING(600),
            field: 'whitepaper',
            allowNull: false,
        },
        website: {
            type: DataTypes.STRING(600),
            field: 'website',
            allowNull: false
        },
        state: {
            type: DataTypes.STRING(128),
            field: 'state',
            allowNull: false
        },
        published_on: {
            type: DataTypes.STRING(128),
            field: 'published_on',
            allowNull: false,
        },
        discord: {
            type: DataTypes.STRING(600),
            field: 'discord',
            allowNull: false
        },
        twitter: {
            type: DataTypes.STRING(600),
            field: 'twitter',
            allowNull: false
        },
        medium: {
            type: DataTypes.STRING(600),
            field: 'medium',
            allowNull: false
        },
        location: {
            type: DataTypes.STRING(255),
            field: 'location',
            allowNull: false
        },
        language:{
            type: DataTypes.STRING(255),
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
