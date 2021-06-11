const sequelize = require('sequelize');
const ut = require('../modules/util');
const rm = require('../modules/responseMessage');
const sc = require('../modules/statusCode');
const jwt = require('../modules/jwt')
const { User } = require('../models');
const userService = require('../service/userService')


module.exports = {
    login : async(req,res) => {
        let user = null;
        
        const {
            snsId,
            provider
        } = req.body;

        try {
            user = await User.findOne({
                where:{
                    snsId,
                    provider
                }
            }) 
            if (!user){
                user = await User.create({
                    snsId,
                    provider,
                    level: "보드신입생"
                })
                
            }
            const {accessToken,refreshToken} = await jwt.sign(user);
            
        return res.status(sc.OK).send(ut.success(sc.OK,rm.SIGN_IN_SUCCESS,{
            accessToken,
            refreshToken
        }))
        } catch(error){
            console.error(error);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.SIGN_IN_FAIL));
        }

    },

    /* 유저 닉네임 수정 PUT: [ /user ] */
    updateNickName: async (req, res) => {
        const { UserIdx } = req.decoded
        const { nickName } = req.body;
        try {
            const userInfo = await userService.updateNickName(UserIdx, nickName);
            if (!userInfo) {
                console.log('회원 정보가 없습니다!');
                return res.status(sc.NO_CONTENT).send(ut.fail(sc.NO_CONTENT, "회원 정보가 없습니다!"));
            }
            return res.status(sc.OK).send(ut.success(sc.OK, "회원 닉네임 수정 성공"));
        } catch (error) {
            console.error(error);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        }
    },

    /* 마이페이지 유저 정보 조회 GET: [ /user ] */
    getUserInfo: async (req, res) => {
        const { UserIdx } = req.decoded
        try {
            const userInfo = await userService.getUserInfo(UserIdx);
            if (!userInfo) {
                console.log('유저 정보가 없습니다!');
                return res.status(sc.NO_CONTENT).send(ut.fail(sc.NO_CONTENT, "유저 정보가 없습니다!"));
            }
            return res.status(sc.OK).send(ut.success(sc.OK, "유저 정보 조회 성공", userInfo));
        } catch (error) {
            console.error(error);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        }
    },

    /* 저장한 보드게임 조회하기 GET: [ /user/saved ] */
    getSavedGames: async (req, res) => {
        const { UserIdx } = req.decoded
        try {
            const savedGames = await userService.getSavedGames(UserIdx);
            if (!savedGames) {
                console.log('보드게임이 없습니다!');
                return res.status(sc.NO_CONTENT).send(ut.fail(sc.NO_CONTENT, "보드게임이 없습니다!"));
            }
            return res.status(sc.OK).send(ut.success(sc.OK, "저장한 보드게임 조회 성공", savedGames));
        } catch (error) {
            console.error(error);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        }
    },

    /* 플레이한 보드게임 GET: [ user/played ] */
    getPlayedGames: async (req, res) => {
        const { UserIdx } = req.decoded
        try {
            const gameReview = await userService.getPlayedGames(UserIdx);
            if (!gameReview) {
                console.log('플레이한 보드게임이 없습니다!');
                return res.status(sc.NO_CONTENT).send(ut.fail(sc.NO_CONTENT, "플레이한 보드게임이 없습니다!"));
            }
            return res.status(sc.OK).send(ut.success(sc.OK, "플레이한 보드게임 조회 성공", gameReview));
        } catch (error) {
            console.error(error);
            return res.status(sc.INTERNAL_SERVER_ERROR).send(ut.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
        }
    },

}