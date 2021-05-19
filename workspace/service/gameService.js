const { Boardgame, User, Saved, Review } = require('../models');
const commonService = require('../service/commonService')
const { search } = require('../routes');
const sequelize = require('sequelize');
const Op = sequelize.Op;


module.exports = {

    /* 트렌딩 게임 조회 */
    getTrending: async () => {
        try {

            const trendingGame = await Boardgame.findAll({
                // where:{
                //     day: day,
                // },
                attributes: ['GameIdx', 'name', 'intro', 'imageUrl'], 
                limit: 7
            })
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
            console.log('esss')

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
                attributes: ['GameIdx', [sequelize.fn('COUNT', 'GameIdx'), 'count']],
                group: ['GameIdx'],
            })

            const reviews = await Review.findAll({
                attributes: ['GameIdx', 'star']
            })
            // const reviews = await Review.findAll({
            //     attributes: ['GameIdx', [sequelize.fn('sum', sequelize.col('GameIdx')), 'sum']],
            //     group: ['star'],
            // })

            const result = await commonService.getSavedCountReview(searchedGame, savedGame, savedGameCount, reviews)
            
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
    getBoardgames: async (UserIdx, pageIdx) => {
        try {
            const user = await User.findOne({
                where: {
                    UserIdx,
                }
            });

            const searchedGame = await Boardgame.findAll({
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
                attributes: ['GameIdx', [sequelize.fn('COUNT', 'GameIdx'), 'count']],
                group: ['GameIdx'],
            })

            const reviews = await Review.findAll({
                attributes: ['GameIdx', 'star']
            })
            // const reviews = await Review.findAll({
            //     attributes: ['GameIdx', [sequelize.fn('sum', sequelize.col('GameIdx')), 'sum']],
            //     group: ['star'],
            // })

            const left = pageIdx * 10
            const right = pageIdx * 10 + 10
            const result = await commonService.getSavedCountReview(searchedGame.slice(left, right), savedGame, savedGameCount, reviews)
            return result;
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