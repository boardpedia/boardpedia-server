const { Boardgame, User } = require('../models');

module.exports = {

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
    
    // getChatById: async (chatDetailsIdx) => {
    //     try {
    //         const postInfo = await ChatDetails.findOne({
    //             where:{
                    
    //                 chatDetailsIdx: chatDetailsIdx,
    //             },
    //             attributes: ['replyNum','replyType']
    //         })
    //         const chat = await Chat.findAll({
    //             where : {
    //                 chatDetailsIdx: chatDetailsIdx,
    //             },
    //             attributes: ['text','nextAction'],
    //         });
    //         const aponymousChat = ({
    //             chat,
    //             postInfo
    //         });
    //         return aponymousChat;
    //     } catch (error) {
    //         throw error;
    //     }
    // },

    

}