const express = require('express');
const router = express.Router();
//const authUtils = require('../../middlewares/authUtils')

const gameController = require('../../controller/gameController')

// router.get('/:chatDetailsIdx',authUtils.checkToken, chatController.readChat);
// router.get('/day/:day', authUtils.checkToken, chatController.readChatAll);

/* 트렌딩 게임 조회하기	(인기 검색어 조회) */
router.get('/trending', gameController.getTrending);
/* 보드게임 검색하기 */
//router.post('/search', gameController.searchGame);
// /* 보드게임 검색 결과 조회	*/
// router.get('/search', gameController);
// /* 보드게임 추가하기 */
// router.post('/add', gameController);

/* 보드게임 저장하기 */
router.post('/save', gameController.saveGame);
/*보드게임 저장 취소하기	*/
router.delete('/save', gameController.saveGameUndo);

module.exports = router;
