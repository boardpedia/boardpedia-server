const express = require('express');
const router = express.Router();
const authUtils = require('../../middlewares/authUtils')

const gameController = require('../../controller/gameController')

/* 트렌딩 게임 조회하기	(인기 검색어 조회) */
router.get('/trending', authUtils.checkToken, gameController.getTrending);

/* 보드게임 검색하기 및 결과 조회 */
router.post('/search', authUtils.checkToken, gameController.searchGame);

/* 보드게임 추가하기 */
router.post('/add', authUtils.checkToken, gameController.addGame);

/* 보드게임 저장하기 */
router.post('/save', authUtils.checkToken, gameController.saveGame);

/*보드게임 저장 취소하기	*/
router.delete('/save', authUtils.checkToken, gameController.saveGameUndo);

/* 전체 보드게임 조회하기 */
//router.get('/:pageIdx', authUtils.checkToken, gameController.getBoardgames);

/* 조건에 맞는 보드게임 조회하기 */
router.post('/filter/:pageIdx', authUtils.checkToken, gameController.filterGame);

/* 보드게임 상세 조회하기 */
router.get('/detail/:gameIdx', authUtils.checkToken, gameController.getBoardgameDetail);

/* 보드게임 후기 조회하기 */
router.get('/review/:gameIdx', authUtils.checkToken, gameController.getGameReviews);

/* 유사한 보드게임 조회하기 */
router.get('/similar/:gameIdx', authUtils.checkToken, gameController.getSimilarGames);

/* 보드게임 후기 추가하기 */
router.post('/review/:gameIdx', authUtils.checkToken, gameController.postGameReviews);


module.exports = router;
