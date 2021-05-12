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
            console.log(user.UserIdx)
            console.log(name)

            const searchedGame = await Boardgame.findAll({
                where:{
                    // 유사한 이름도 검색 가능
                    name: {
                        [Op.like]: '%' + name + '%'
                    }
                },
                attributes: ['GameIdx', 'name', 'intro', 'imageUrl'], 
            })
            
            const savedGame = await Saved.findAll({
                where : {
                    GameIdx: searchedGame[0].GameIdx,
                    UserIdx: user.UserIdx,
                },
                attributes: ['GameIdx']
            })

            const reviews = await Review.findAll({
                // where:{
                //     GameIdx: searchedGame[0].GameIdx,
                // },
                attributes: ['GameIdx', 'star']
            })

            for (i = 0; i < searchedGame.length; i++) { 
                // for games in searchedGame, if GameIdx exists in savedGame, create new parameter in result
                for (j = 0; j < savedGame.length; j++) { 
                    if (searchedGame[i].GameIdx == savedGame[j].GameIdx) {
                        searchedGame[i].dataValues.Saved = 1;
                        console.log(searchedGame[i].GameIdx, savedGame[j].GameIdx)
                    } else {
                        searchedGame[i].dataValues.Saved = 0;
                    }

                }
            }
            // 저장된 게임의 결과가 없을 경우 다 save = 0 으로 표시
            if (savedGame.length == 0) {
                for (i = 0; i < searchedGame.length; i++) { 
                    searchedGame[i].dataValues.Saved = 0;
                }
            }
            // 후기 별점 평균 구해서 새로 파라미터 추가해주기
            console.log(searchedGame)

            // for (i = 0; i < reviews.length; i++) { 
            //     for (j = 0; j < searchedGame.length; j++) { 
            //         if (reviews[i].GameIdx == searchedGame[j].GameIdx) {

            //     }

            // }

            //console.log(savedGame.length)
            const result = ({
                searchedGame, 
                reviews
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
            
            const saveGame = await Saved.create({
                GameIdx
            });

            await user.addSaved(saveGame)
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
            
            const saveGame = await Saved.destroy({
                where: {
                    GameIdx,
                }
            });

            await user.removeSaved(saveGame)
            return saveGame;
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