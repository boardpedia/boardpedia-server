module.exports = (sequelize, DataTypes) => {
    return sequelize.define('NickName', {
        NickNameInx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        words: {
            type: DataTypes.STRING(20),
            unique: true,
            allowNull: true,
        }

    }, {
        //모델의 옵션들을 지정하는곳   
        tableName: 'NICKNAME',
        timestamps: false,

    });
};