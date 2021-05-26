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
            provider,
            nickName
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
                    level: "보드신입생",
                    nickName
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
}