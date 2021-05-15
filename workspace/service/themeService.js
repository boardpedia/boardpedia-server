const { Boardgame, Theme, Saved, Review, User } = require('../models');
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
                limit: 3,
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
            })

            savedGameCount.count = savedGameCount.count

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
                themes,
                searchedGame
            });

            return result;
        } catch (error) {
            throw error;
        }
    },
    

}