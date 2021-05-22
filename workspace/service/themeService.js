const { Boardgame, Theme, Saved, Review, User } = require('../models');
const commonService = require('../service/commonService')

const { search } = require('../routes');
const sequelize = require('sequelize');
const Op = sequelize.Op;


module.exports = {

    /* 테마 조회 */
    getTheme: async () => {
        try {
            const themes = await Theme.findAll({
                // 랜덤으로 리턴해주는 로직 추가하기
                order: [
                    [sequelize.literal('RAND()')]
                ],
                limit: 9,
                attributes: ['ThemeIdx', 'name', 'detail', 'tag', 'imageUrl']
                
            });

            for (i = 0; i < themes.length; i++) {
                var res = themes[i].tag.split(";");
                themes[i].tag = res
            }

            
            return themes;
        } catch (error) {
            throw error;
        }
    },
    

    /* 테마 상세 조회 */
    getThemeDetail: async (UserIdx, ThemeIdx) => {
        try {
            const user = await User.findOne({
                where: {
                    UserIdx
                },
                attributes: ['UserIdx']
            });

            const themes = await Theme.findAll({
                where:{
                    themeIdx: ThemeIdx,
                },
                attributes: ['ThemeIdx', 'name', 'detail', 'imageUrl', 'tag'], 
            });
            for (i = 0; i < themes.length; i++) {
                var res = themes[i].tag.split(";");
                themes[i].tag = res
            }

            const searchedGame = await Boardgame.findAll({
                where:{
                    ThemeIdx
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
                raw: true
            })

            savedGameCount.count = savedGameCount.count

            const reviews = await Review.findAll({
                attributes: ['GameIdx', 'star']
            })
            // const reviews = await Review.findAll({
            //     attributes: ['GameIdx', [sequelize.fn('sum', sequelize.col('GameIdx')), 'sum']],
            //     group: ['star'],
            // })

            const themeGame = await commonService.getSavedCountReview(searchedGame, savedGame, savedGameCount, reviews)
            const result = ({
                themes,
                themeGame
            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    

}