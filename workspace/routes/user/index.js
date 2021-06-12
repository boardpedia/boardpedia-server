const express = require('express');
const router = express.Router();
const authUtils = require('../../middlewares/authUtils')
const userController = require('../../controller/userController')

/* 사용자 로그인 /user/login */
router.post('/login', userController.login);

/* 사용자 닉네임 수정 /user */
router.put('/', authUtils.checkToken, userController.updateNickName);

/* 마이페이지 유저 정보 조회 /user */
router.get('/', authUtils.checkToken, userController.getUserInfo);

/* 저장한 보드게임 조회하기 GET: [ /game/played ]*/
router.get('/saved', authUtils.checkToken, userController.getSavedGames);

/* 플레이한 보드게임 조회하기 GET: [ /game/played ]*/
router.get('/played', authUtils.checkToken, userController.getPlayedGames);

/* 사용자 탈퇴 /user */
router.delete('/', authUtils.checkToken, userController.deleteUser);

module.exports = router;