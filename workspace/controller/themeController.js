const sequelize = require('sequelize');

const ut = require('../modules/util');
const rm = require('../modules/responseMessage');
const sc = require('../modules/statusCode');

const themeService = require('../service/themeService')

module.exports = {

    /* 오늘의 추천 테마 조회  GET : [ /theme] */
    getTheme: async (req, res) => {
        try {
            const themes = await themeService.getTheme();
            if (!themes) {
                console.log('테마가 없습니다');
                return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
            }
            return res.status(sc.OK).send(ut.success(sc.OK, "오늘의 추천 테마 조회 성공", themes));
        } catch (error) {
            console.error(error);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        }
    },
}