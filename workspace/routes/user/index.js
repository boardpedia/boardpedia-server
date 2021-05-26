const express = require('express');
const router = express.Router();
const authUtils = require('../../middlewares/authUtils')
const userController = require('../../controller/userController')

/* 사용자 로그인 /user/login */
router.post('/login', userController.login);

/* 마이페이지 유저 정보 조회 /user */
router.get('/', authUtils.checkToken, userController.getUserInfo);


module.exports = router;