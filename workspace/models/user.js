module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        UserIdx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        snsId: {
            type: DataTypes.STRING(100),
            unique: false,
            allowNull: true,
        },
        provider: {
            type: DataTypes.STRING(20),
            unique: false,
            allowNull: true,
        },
        userName: {
            type: DataTypes.STRING(10),
            unique: false,
            allowNull: true,
        },
        nickName: {
            type: DataTypes.STRING(10),
            unique: false,
            allowNull: true,
        },
        refreshToken: {
            type: DataTypes.STRING(200),
            unique: true,
            allowNull: true,
        },
        level: {
            type: DataTypes.STRING(10),
            unique: false,
            allowNull: false,
            defaultValue: '보드신입생',
        },

    }, {
        //모델의 옵션들을 지정하는곳   
        tableName: 'USER',
        timestamps: true,

    });
};