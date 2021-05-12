const { Boardgame, Theme, Saved, Review } = require('../models');
const { search } = require('../routes');
const sequelize = require('sequelize');
const Op = sequelize.Op;


module.exports = {

    /* 테마  조회 */
    getTheme: async () => {
        try {
            const themes = await Theme.findAll({
                // 랜덤으로 리턴해주는 로직 추가하기
                order: [
                    [sequelize.literal('RAND()')]
                  ],
                  limit: 3,
                
            });
            
            return themes;
        } catch (error) {
            throw error;
        }
    },
    

}