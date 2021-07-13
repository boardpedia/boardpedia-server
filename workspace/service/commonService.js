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
                for (j = 0; j <= savedGame.length - 1; j++) { 
                    if (searchedGame[i].GameIdx == savedGame[j].GameIdx) {
                        searchedGame[i].dataValues.saved = 1;
                        //console.log('saved', searchedGame[i].GameIdx, savedGame[j].GameIdx)
                        break
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
                for (j = 0; j <= savedGameCount.length - 1; j++) { 
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

    /* 사용자 레벨업 로직 
    실버: 회원가입 5일차, 저장횟수 3회, 후기갯수 1회
    골드: 회원가입 7일차, 저장횟수 8회, 후기갯수 4회
    다이아: 회원가입 21일차, 저장횟수 12회, 후기갯수 8회
    */
    checkLevelUp: async (UserIdx) => {
        try {
            // 회원가입 일수 체크
            const user = await User.findOne({
                where: {
                    UserIdx,
                },
                attributes : ['UserIdx', 'nickName', 'level', 'createdAt', 'updatedAt']
            });
            var today = new Date()
            var diff = Math.abs(today - user.dataValues.createdAt);
            var days = diff / 60000 / 60 / 24
            
            // 유저의 게임 저장 횟수
            const savedCount = await Saved.findAll({
                where: {
                    UserIdx
                }
            })
            var saved = 0
            if (savedCount != null) {
                saved = savedCount.length
            }

            // 유저의 후기 갯수
            const reviewCount = await Review.findAll({
                where: {
                    UserIdx
                }
            })
            var review = 0
            if (reviewCount != null) {
                review = reviewCount.length
            }
            console.log(days, saved, review)

            // 회원가입 조건 확인
            if (5 < days < 7 && 3 <= saved && 1 <= review) {
                user.update({
                    level: '실버'
                })
            } else if (7 < days < 21 && 8 <= saved && 4 <= review) {
                user.update({
                    level: '골드'
                })
            } else if (21 < days && 12 <= saved && 8 <= review) {
                user.update({
                    level: '다이아'
                })
            } 

            return user
        } catch(error) {
            throw error;
        }
    },

    

}