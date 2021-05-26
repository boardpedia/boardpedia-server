const { Boardgame, Theme, Saved, Review, User } = require('../models');

const { search } = require('../routes');
const sequelize = require('sequelize');
const Op = sequelize.Op;


module.exports = {
    getUserInfo: async (UserIdx) => {
        try {
            const user = await User.findOne({
                where: {
                    UserIdx,
                },
                attributes : ['UserIdx', 'nickName', 'level']
            });

            return user;
        } catch (error) {
            throw error;
        }
    },



    

}