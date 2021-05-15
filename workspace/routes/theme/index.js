const express = require('express');
const router = express.Router();
//const authUtils = require('../../middlewares/authUtils')

const themeController = require('../../controller/themeController')

// router.get('/:chatDetailsIdx',authUtils.checkToken, chatController.readChat);
// router.get('/day/:day', authUtils.checkToken, chatController.readChatAll);

/* 오늘의 추천 테마 조회 */
router.get('/', themeController.getTheme);

/* 오늘의 추천 테마 상세 조회 */
router.get('/:themeIdx', themeController.getThemeDetail);


module.exports = router;
