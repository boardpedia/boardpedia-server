const express = require('express');
const router = express.Router();
const authUtils = require('../../middlewares/authUtils')

const themeController = require('../../controller/themeController')

/* 오늘의 추천 테마 조회 */
router.get('/', authUtils.checkToken, themeController.getTheme);

/* 오늘의 추천 테마 상세 조회 */
router.get('/:themeIdx', authUtils.checkToken, themeController.getThemeDetail);


module.exports = router;
