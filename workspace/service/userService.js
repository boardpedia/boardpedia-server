const { Boardgame, Theme, Saved, Review, User } = require('../models');
const commonService = require('../service/commonService')

const { search } = require('../routes');
const sequelize = require('sequelize');
const Op = sequelize.Op;

module.exports = {

    /* 사용자 정보 조회 GET: [/user] */
    getUserInfo: async (UserIdx) => {
        try { 
            // 레벨업 기준을 충족한다면
            const levelup = await commonService.checkLevelUp(UserIdx)
            return levelup;
        } catch (error) {
            throw error;
        }
    },

    /* 사용자 닉네임 수정 PUT : [/user] */
    updateNickName: async (UserIdx, nickName) => {

        try {
            const user = await User.update(
                { nickName , 
                attributes : ['UserIdx', 'nickName', 'level'] },
                { where: { UserIdx } , },
            )

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

    /* 저장한 보드게임 조회 GET : [ /user/saved] */
    getSavedGames: async (UserIdx) => {
        try {
            const user = await User.findOne({
                where: {
                    UserIdx,
                }
            });

            const allGames = await Saved.findAll({

                attributes: ['SavedIdx'], 
                where : {
                    UserIdx,
                }, 

                include: [{
                    model: Boardgame,
                    attributes: ['GameIdx', 'name', 'intro', 'imageUrl'], 
                }]
            });
            return allGames;
        } catch (error) {
            throw error;
        }
    },

    /* 회원 탈퇴 DELETE : [ /user ] */
    deleteUser: async (UserIdx) => {
        try {
            const user = await User.destroy({
                where: {
                    UserIdx,
                },
                attributes: ['UserIdx', 'nickName']
            });
            return user;
        } catch (error) {
            throw error;
        }
    },
}