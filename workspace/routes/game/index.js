const express = require('express');
const router = express.Router();
//const authUtils = require('../../middlewares/authUtils')

const gameController = require('../../controller/gameController')

// router.get('/:chatDetailsIdx',authUtils.checkToken, chatController.readChat);
// router.get('/day/:day', authUtils.checkToken, chatController.readChatAll);

/* 트렌딩 게임 조회하기	(인기 검색어 조회) */
router.get('/trending', gameController.getTrending);
/* 보드게임 검색하기 및 결과 조회 */
router.post('/search', gameController.searchGame);

// /* 보드게임 추가하기 */
// router.post('/add', gameController);

/* 보드게임 저장하기 */
router.post('/save', gameController.saveGame);
/*보드게임 저장 취소하기	*/
router.delete('/save', gameController.saveGameUndo);

/* 저장한 보드게임 조회 GET : [ /game/saved] */
router.get('/saved', gameController.getSavedGames);

/* 전체 보드게임 조회하기 */
router.get('/:pageIdx', gameController.getBoardgames);


module.exports = router;
