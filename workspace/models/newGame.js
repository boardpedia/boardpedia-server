module.exports = (sequelize, DataTypes) => {
    return sequelize.define('NewGame', {
        NewGameIdx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(45),
            unique: false,
            allowNull: true,
            defaultValue: ''
        },
        playerNum: {
            type: DataTypes.STRING(45),
            unique: false,
            allowNull: true,
            defaultValue: 0
        },
        maxPlayerNum: {
            type: DataTypes.STRING(45),
            unique: false,
            allowNull: true,
            defaultValue: 0
        },
        duration: {
            type: DataTypes.STRING(45),
            unique: false,
            allowNull: true,
            defaultValue: ''
        },
        level: {
            type: DataTypes.STRING(45),
            unique: false,
            allowNull: true,
            defaultValue: ''
        },
        tag: {
            type: DataTypes.STRING(100),
            unique: false,
            allowNull: true,
            defaultValue: ''
        },
        
    }, {
        //모델의 옵션들을 지정하는곳 
        tableName: 'NEW_BOARDGAME',  
        timestamps: true,

    });
};