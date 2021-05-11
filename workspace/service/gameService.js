const { Boardgame, User, Saved } = require('../models');

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

    /* 보드게임 검색 */
    searchGame: async (name) => {
        try {
            // const user = await User.findOne({
            //     where: {
            //         UserIdx,
            //     }
            // });
            console.log('here')
            const searchedGame = await Boardgame.findAll({
                where:{
                    name: name
                },
                attributes: ['GameIdx', 'name', 'intro', 'imageUrl'], 
                // include: [{
                //     model: Chat,
                //     attributes: ['text']
                // },
                // ]
            })

            return searchedGame;
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
    
    

    

}