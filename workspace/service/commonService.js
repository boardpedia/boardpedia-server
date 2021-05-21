const { Boardgame, Theme, Saved, Review, User } = require('../models');

const { search } = require('../routes');
const sequelize = require('sequelize');
const Op = sequelize.Op;


module.exports = {
    getSavedCountReview: async (searchedGame, savedGame, savedGameCount, reviews) => {
        try {
            for (i = 0; i < searchedGame.length; i++) { 
                // 'saved': 저장 여부 파라미터 추가해주기
                searchedGame[i].dataValues.saved = 0;

                // 'saveCount': 저장 횟수 파라미터 추가해주기
                searchedGame[i].dataValues.saveCount = 0;

                // 'star: 별점 파라미터 추가해주기'
                searchedGame[i].dataValues.star = 0;
                var cnt = 0

                // 저장 여부 탐색하기
                for (j = 0; j < savedGame.length; j++) { 
                    if (searchedGame[i].GameIdx == savedGame[j].GameIdx) {
                        searchedGame[i].dataValues.saved = 1;
                        console.log(searchedGame[i].GameIdx, savedGame[j].GameIdx)
                    } else {
                        searchedGame[i].dataValues.saved = 0;
                    }
                }

                // 게임 별 평점 계산하기
                for (j = 0; j < reviews.length; j++) { 
                    if (searchedGame[i].GameIdx == reviews[j].GameIdx) {
                        cnt ++
                        searchedGame[i].dataValues.star = searchedGame[i].dataValues.star + reviews[j].star
                    } 
                }
                if (cnt > 0) {
                    searchedGame[i].dataValues.star =  searchedGame[i].dataValues.star / cnt
                }

                // 저장 카운트 매핑해주기
                for (j = 0; j < savedGameCount.length; j++) { 
                    if (searchedGame[i].GameIdx == savedGameCount[j].GameIdx) {
                        searchedGame[i].dataValues.saveCount = searchedGame[i].dataValues.saveCount + savedGameCount[j].count
                    }
                }

                
                
            }

            return searchedGame;
        } catch (error) {
            throw error;
        }
    },

    

}