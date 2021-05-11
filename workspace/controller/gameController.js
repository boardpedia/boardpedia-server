const sequelize = require('sequelize');
const ut = require('../modules/util');
const rm = require('../modules/responseMessage');
const sc = require('../modules/statusCode');
//뒤 형식으로 모델 추가하기 const {User,Post,Class,} = require('../models');

const gameService = require('../service/gameService')

module.exports = {

    /* 트렌딩 게임 조회하기  GET : [ /game/trending] */
    getTrending: async (req, res) => {
        // const day = req.params.day;
        // const {UserIdx} = req.decoded
        try {
            const trendingGames = await gameService.getTrending();
            if (!trendingGames) {
                console.log('Trending Game이 없습니다!');
                return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
            }
            return res.status(sc.OK).send(ut.success(sc.OK, "트렌딩 게임 조회 (인기 검색어 조회) 성공", trendingGames));
        } catch (error) {
            console.error(error);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        }
    },

}