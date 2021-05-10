module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Review', {
        ReviewIdx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        star: {
            type: DataTypes.INTEGER,
            unique: false,
            allowNull: true,
            defaultValue: 0
        },
        keyword: {
            type: DataTypes.STRING(45),
            unique: false,
            allowNull: true,
            defaultValue: ''
        },
    
        
    }, {
        //모델의 옵션들을 지정하는곳 
        tableName: 'REVIEW',  
        timestamps: true,
    });
};