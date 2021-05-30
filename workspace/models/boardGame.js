module.exports = (sequelize, DataTypes) => {
    return sequelize.define('BoardGame', {
        GameIdx: {
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
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: true,
            //defaultValue: ''
        },
        maxPlayerNum: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: true,
            //defaultValue: ''
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
        intro: {
            type: DataTypes.STRING(100),
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
        imageUrl: {
            type: DataTypes.STRING(200),
            unique: false,
            allowNull: true,
            defaultValue: ''
        }
        
    }, {
        //모델의 옵션들을 지정하는곳 
        tableName: 'BOARDGAME',  
        timestamps: false,

    });
};