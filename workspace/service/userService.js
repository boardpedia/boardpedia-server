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

    /* 보드게임 후기 조회 GET : [ /game/played] */
    getPlayedGames: async (UserIdx) => {
        try {
            const reviews = await Review.findAll({
                attributes: ['ReviewIdx', 'star', 'keyword'], 
                where : {
                    UserIdx
                },

                include: [{
                    model: Boardgame,
                    attributes: ['GameIdx', 'name', 'imageUrl'], 
                }]
                
            });

            // 키워드 배열로 변환
            for (i = 0; i < reviews.length; i++) {
                var res = reviews[i].keyword.split(";");
                reviews[i].keyword = res
            }

            return reviews
            
        } catch (error) {
            throw error;
        }
    },




    

}