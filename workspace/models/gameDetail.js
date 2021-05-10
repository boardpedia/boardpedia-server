module.exports = (sequelize, DataTypes) => {
    return sequelize.define('BoardgameDetail', {
        DetailIdx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        objective: {
            type: DataTypes.STRING(100),
            unique: false,
            allowNull: true,
            defaultValue: ''
        },
        method: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true,
            defaultValue: ''
        },
        webUrl: {
            type: DataTypes.STRING(200),
            unique: false,
            allowNull: true,
            defaultValue: ''
        }
        
    }, {
        //모델의 옵션들을 지정하는곳 
        tableName: 'BOARDGAME_DETAIL',  
        timestamps: false,
    });
};