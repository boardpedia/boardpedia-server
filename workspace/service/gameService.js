const { Boardgame, User, Saved, Review } = require('../models');
const { search } = require('../routes');
const sequelize = require('sequelize');
const Op = sequelize.Op;


module.exports = {

    /* 트렌딩 게임 조회 */
    getTrending: async () => {
        try {
            // const user = await User.findOne({
            // where: {
            //     UserIdx
            // },
            // attributes: ['UserIdx']
            // });

            const trendingGame = await Boardgame.findAll({
                // where:{
                //     day: day,
                // },
                attributes: ['GameIdx', 'name', 'intro', 'imageUrl'], 
                // include: [{
                //     model: Chat,
                //     attributes: ['text']
                // },
                // ]
            })
            // const userReply = await ChatDetails.findAll({
            //     where:{
            //         day: day,
            //     },
            //     attributes: ['ChatDetailsIdx'],
            //     include: [
            //     {
            //         model: Reply,
            //         where: {
            //             UserIdx: user.UserIdx,
            //         },
            //         attributes: ['replyString', 'replyFile']
            //     }]
            // })
            // const trendingGame = ({
            //     trendingGame
            // });
            return trendingGame;
        } catch (error) {
            throw error;
        }
    },

    /* 보드게임 검색 및 결과 조회 */
    searchGame: async (UserIdx, name) => {
        try {
            const user = await User.findOne({
                where: {
                    UserIdx
                },
                attributes: ['UserIdx']
            });

            const searchedGame = await Boardgame.findAll({
                where:{
                    // 유사한 이름도 검색 가능
                    name: {
                        [Op.like]: '%' + name + '%'
                    }
                },
                attributes: ['GameIdx', 'name', 'intro', 'imageUrl'], 
            })

            // 유저가 저장한 게임만 리턴
            const savedGame = await Saved.findAll({
                where : {
                    UserIdx: user.UserIdx,
                },
                attributes: ['GameIdx']
            })

            // 게임당 저장 회수 리턴
            const savedGameCount = await Saved.findAll({
                group: ['GameIdx'],
                attributes: ['GameIdx', [sequelize.fn('COUNT', 'GameIdx'), 'count']]
            
            })

            console.log(savedGameCount.count, 'yesssss')

            const reviews = await Review.findAll({
                attributes: ['GameIdx', 'star']
            })
            // const reviews = await Review.findAll({
            //     attributes: ['GameIdx', [sequelize.fn('sum', sequelize.col('GameIdx')), 'sum']],
            //     group: ['star'],
            // })

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
                        console.log(searchedGame[i].GameIdx, savedGameCount[j].GameIdx)
                        console.log(savedGameCount[j].count)
                        searchedGame[i].dataValues.saveCount = searchedGame[i].dataValues.saveCount + savedGameCount[j].count
                    }
                }
                
            }


        
            const result = ({
                searchedGame, 
                savedGameCount
            });
            return result;
        } catch (error) {
            throw error;
        }
    },


    /* 보드게임 저장 POST : [ /game/save] */
    saveGame: async (UserIdx, GameIdx) => {
        try {
            const user = await User.findOne({
                where: {
                    UserIdx,
                }
            });

            const check = await Saved.findOne({
                where: {
                    UserIdx,
                    GameIdx
                }
            });
            if (check) {
                console.log('이미 저장된 보드게임입니다.')
                return
            } else {
                const saveGame = await Saved.create({
                    GameIdx
                });
                await user.addSaved(saveGame)
            }
            return GameIdx;
        } catch (error) {
            throw error;
        }
    },

    /* 보드게임 저장 취소 DELETE : [ /game/save] */
    saveGameUndo: async (UserIdx, GameIdx) => {
        try {
            const user = await User.findOne({
                where: {
                    UserIdx,
                }
            });

            const check = await Saved.findOne({
                where: {
                    UserIdx,
                    GameIdx
                }
            });
            
            if (check) {
                const saveGame = await Saved.destroy({
                    where: {
                        GameIdx,
                    }
                });
                await user.removeSaved(saveGame)
            } else {
                console.log('보드게임이 저장되어 있지 않습니다.')
                return
                
            }   
            return GameIdx;
        } catch (error) {
            throw error;
        }
    },

    /* 보드게임 전체 조회 GET : [ /game] */
    getBoardgames: async (UserIdx) => {
        try {
            const user = await User.findOne({
                where: {
                    UserIdx,
                }
            });

            const allGames = await Boardgame.findAll({
                attributes: ['GameIdx', 'name', 'intro', 'imageUrl'], 
                
                include: [{
                    model: Saved,
                    attributes: ['UserIdx'],
                    where : {
                        UserIdx,
                    }, 
                }]
            });

            // const userReply = await ChatDetails.findAll({
            //     where:{
            //         day: day,
            //     },
            //     attributes: ['ChatDetailsIdx'],
            //     include: [
            //     {
            //         model: Reply,
            //         where: {
            //             UserIdx: user.UserIdx,
            //         },
            //         attributes: ['replyString', 'replyFile']
            //     }]
            // })
            // const trendingGame = ({
            //     trendingGame
            // });

            return allGames;
        } catch (error) {
            throw error;
        }
    },

    /* 저장한 보드게임 조회 GET : [ /game/saved] */
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
    
    

    

}