const sequelize = require('sequelize');
const ut = require('../modules/util');
const rm = require('../modules/responseMessage');
const sc = require('../modules/statusCode');

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
    /* 보드게임 검색하기 POST : [ /game/search ]*/
    searchGame: async (req, res) => {
        // const {UserIdx} = req.decoded
        const { inputWord } = req.body;
        try {
            const searchWord = await gameService.searchGame(inputWord);
            if (!searchWord) {
                console.log('검색 결과가 없습니다!');
                return res.status(sc.NOT_FOUND).send(ut.fail(sc.NOT_FOUND, "검색 결과가 없습니다!"));
            }
            return res.status(sc.OK).send(ut.success(sc.OK, "보드게임 검색 성공"));
        } catch (error) {
            console.error(error);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        }
    },

    /* 보드게임 저장하기 POST: [ /game/save/:gameIdx ] */
    saveGame: async (req, res) => {
        // const {UserIdx} = req.decoded
        const { gameIdx } = req.body;
        try {
            const saveGame = await gameService.saveGame(1, gameIdx);
            if (!saveGame) {
                console.log('게임이 존재하지 않습니다!');
                return res.status(sc.NOT_FOUND).send(ut.fail(sc.NOT_FOUND, "게임이 존재하지 않습니다!"));
            }
            return res.status(sc.OK).send(ut.success(sc.OK, "보드게임 저장 성공"));
        } catch (error) {
            console.error(error);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        }
    },


    /* 보드게임 저장 취소하기 DELETE: [ /game/save/:gameIdx] */
    saveGameUndo: async (req, res) => {
        // const {UserIdx} = req.decoded
        const { gameIdx } = req.body;
        try {
            const saveGame = await gameService.saveGameUndo(1, gameIdx);
            if (!saveGame) {
                console.log('보드게임이 저장돼있지 않습니다!');
                return res.status(sc.NOT_FOUND).send(ut.fail(sc.NOT_FOUND, "보드게임이 저장돼있지 않습니다!"));
            }
            return res.status(sc.OK).send(ut.success(sc.OK, "보드게임 저장 취소 성공"));
        } catch (error) {
            console.error(error);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        }
    },

}