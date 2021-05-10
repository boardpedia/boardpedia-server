module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Theme', {
        ThemeIdx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(30),
            unique: false,
            allowNull: true,
            defaultValue: ''
        },
        detail: {
            type: DataTypes.STRING(45),
            unique: false,
            allowNull: true,
            defaultValue: ''
        },
        tag: {
            type: DataTypes.STRING(20),
            unique: false,
            allowNull: true,
            defaultValue: ''
        }
    
        
    }, {
        //모델의 옵션들을 지정하는곳 
        tableName: 'THEME',  
        timestamps: false,

    });
};