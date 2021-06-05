const { Boardgame, BoardgameDetail, User, Saved, Review } = require('../models');
const commonService = require('../service/commonService')
const { search } = require('../routes');
const sequelize = require('sequelize');
const gameDetail = require('../models/gameDetail');
const Op = sequelize.Op;


module.exports = {

    /* 트렌딩 게임 조회 */
    getTrending: async (UserIdx) => {
        try {

            const trendingGame = await Boardgame.findAll({
                attributes: ['GameIdx', 'name', 'intro', 'imageUrl'], 
                limit: 7
            })

            // 유저가 저장한 게임만 리턴
            const savedGame = await Saved.findAll({
                where : {
                    UserIdx,
                },
                attributes: ['GameIdx']
            })

            // 게임당 저장 회수 리턴
            const savedGameCount = await Saved.findAll({
                attributes: ['GameIdx', [sequelize.fn('COUNT', 'GameIdx'), 'count']],
                group: ['GameIdx'],
                raw: true
            })

            const reviews = await Review.findAll({
                attributes: ['GameIdx', 'star']
            })

            // gameIdx

            const result = await commonService.getSavedCountReview(trendingGame, savedGame, savedGameCount, reviews)
            
            return result;
        } catch (error) {
            throw error;
        }
    },

    /* 보드게임 검색 및 결과 조회 */
    searchGame: async (UserIdx, name) => {
        try {
            const user = await User.findOne({
                where: {
                    UserIdx
                },
                attributes: ['UserIdx']
            });

            const searchedGame = await Boardgame.findAll({
                where:{
                    // 유사한 이름도 검색 가능
                    name: {
                        [Op.like]: '%' + name + '%'
                    }
                },
                attributes: ['GameIdx', 'name', 'intro', 'imageUrl'], 
            })

            // 유저가 저장한 게임만 리턴
            const savedGame = await Saved.findAll({
                where : {
                    UserIdx: user.UserIdx,
                },
                attributes: ['GameIdx']
            })

            // 게임당 저장 회수 리턴
            const savedGameCount = await Saved.findAll({
                attributes: ['GameIdx', [sequelize.fn('COUNT', 'GameIdx'), 'count']],
                group: ['GameIdx'],
                raw: true
            })

            const reviews = await Review.findAll({
                attributes: ['GameIdx', 'star']
            })

            const result = await commonService.getSavedCountReview(searchedGame, savedGame, savedGameCount, reviews)
            
            return result;
        } catch (error) {
            throw error;
        }
    },


    /* 보드게임 저장 POST : [ /game/save] */
    saveGame: async (UserIdx, GameIdx) => {
        try {
            const user = await User.findOne({
                where: {
                    UserIdx,
                }
            });

            const check = await Saved.findOne({
                where: {
                    UserIdx,
                    GameIdx
                }
            });
            if (check) {
                console.log('이미 저장된 보드게임입니다.')
                return
            } else {
                const saveGame = await Saved.create({
                    GameIdx
                });
                await user.addSaved(saveGame)
            }
            return GameIdx;
        } catch (error) {
            throw error;
        }
    },

    /* 보드게임 저장 취소 DELETE : [ /game/save] */
    saveGameUndo: async (UserIdx, GameIdx) => {
        try {
            const user = await User.findOne({
                where: {
                    UserIdx,
                }
            });

            const check = await Saved.findOne({
                where: {
                    UserIdx,
                    GameIdx
                }
            });
            
            if (check) {
                const saveGame = await Saved.destroy({
                    where: {
                        GameIdx,
                    }
                });
                await user.removeSaved(saveGame)
            } else {
                console.log('보드게임이 저장되어 있지 않습니다.')
                return
                
            }   
            return GameIdx;
        } catch (error) {
            throw error;
        }
    },

    /* 보드게임 전체 조회 GET : [ /game] */
    getBoardgames: async (UserIdx, pageIdx) => {
        try {
            const user = await User.findOne({
                where: {
                    UserIdx,
                }
            });

            const searchedGame = await Boardgame.findAll({
                attributes: ['GameIdx', 'name', 'intro', 'imageUrl'], 
            })

            // 유저가 저장한 게임만 리턴
            const savedGame = await Saved.findAll({
                where : {
                    UserIdx: user.UserIdx,
                },
                attributes: ['GameIdx']
            })

            // 게임당 저장 회수 리턴
            const savedGameCount = await Saved.findAll({
                attributes: ['GameIdx', [sequelize.fn('COUNT', 'GameIdx'), 'count']],
                group: ['GameIdx'],
                raw: true
            })

            const reviews = await Review.findAll({
                attributes: ['GameIdx', 'star']
            })
            // const reviews = await Review.findAll({
            //     attributes: ['GameIdx', [sequelize.fn('sum', sequelize.col('GameIdx')), 'sum']],
            //     group: ['star'],
            // })

            const left = pageIdx * 10
            const right = pageIdx * 10 + 10
            const result = await commonService.getSavedCountReview(searchedGame.slice(left, right), savedGame, savedGameCount, reviews)
            return result;
        } catch (error) {
            throw error;
        }
    },

    /* 저장한 보드게임 조회 GET : [ /game/saved] */
    getSavedGames: async (UserIdx) => {
        try {
            const user = await User.findOne({
                where: {
                    UserIdx,
                }
            });

            const allGames = await Saved.findAll({

                attributes: ['SavedIdx'], 
                where : {
                    UserIdx,
                }, 

                include: [{
                    model: Boardgame,
                    attributes: ['GameIdx', 'name', 'intro', 'imageUrl'], 
                }]

            });

            return allGames;
        } catch (error) {
            throw error;
        }
    },


    /* 보드게임 필터 검색 조회 POST : [ game/filter] */
    filterGame: async (UserIdx, playerNum, level, tag, duration) => {
        try {
            const user = await User.findOne({
                where: {
                    UserIdx,
                }
            });
            
            // 입력된 데이터 값만 받아주기
            const paramName = ['playerNum', 'level', 'tag', 'duration']
            var params = [playerNum, level, tag, duration]
            const databaseParams = {}
            
            for (j = 0; j < params.length; j++) { 
                if (params[j].length != 0 && params[j] != 0) {
                    // 인원수 파라미터의 경우 최소, 최대 인원 비교
                    if (j == 0) {
                        databaseParams['playerNum'] = {[Op.lte] :  params[j]};
                        databaseParams['maxPlayerNum'] = {[Op.gte] :  params[j]};
                    }
                    // 태그 파라미터의 경우 존재하는 모든 태그에 대해 유사성 검색
                    else if (j == 2) {
                        for (i = 0; i < tag.length; i++) { 
                            databaseParams['tag'] = {
                                [Op.or]: [{
                                    [Op.like]: `%${tag[i]}%`,
                                }]
                            };
                        }
                    }
                    else {
                        databaseParams[paramName[j]] = params[j];
                    }
                    
                }
            }
            //console.log(databaseParams)

            
            const searchedGame = await Boardgame.findAll({
                attributes: ['GameIdx', 'name', 'intro', 'imageUrl', 'tag'], 
                where : {
                    [Op.and]: [
                        databaseParams,
                    ],
                },
            })

            // 유저가 저장한 게임만 리턴
            const savedGame = await Saved.findAll({
                where : {
                    UserIdx: user.UserIdx,
                },
                attributes: ['GameIdx']
            })

            // 게임당 저장 회수 리턴
            const savedGameCount = await Saved.findAll({
                attributes: ['GameIdx', [sequelize.fn('COUNT', 'GameIdx'), 'count']],
                group: ['GameIdx'],
                raw: true
            })

            const reviews = await Review.findAll({
                attributes: ['GameIdx', 'star']
            })
            

            const result = await commonService.getSavedCountReview(searchedGame, savedGame, savedGameCount, reviews)
            return result;
        } catch (error) {
            throw error;
        }
    },

    /* 보드게임 상세 조회 GET : [ /game/:gameIdx] */
    getBoardgameDetail: async (UserIdx, GameIdx) => {
        try {
            const user = await User.findOne({
                where: {
                    UserIdx,
                },
                
            });

            const searchedGame = await Boardgame.findOne({
                attributes: ['GameIdx', 'name', 'intro', 'imageUrl', 'playerNum', 'maxPlayerNum', 'duration', 'level', 'tag'], 
                where: {
                    GameIdx,
                },

            })

            const gameDetail = await BoardgameDetail.findOne({
                attributes: ['objective', 'method', 'webUrl'], 
                where: {
                    GameIdx,
                },
            })

            var res = searchedGame.tag.split("; ");
            searchedGame.tag = res
            
            // 저장 여부 파라미터
            searchedGame.dataValues.saved = 0;

            // 별점 파라미터
            searchedGame.dataValues.star = 0;

            // 게임 목적 파라미터
            searchedGame.dataValues.objective = gameDetail.objective;

            // 게임 링크 파라미터
            searchedGame.dataValues.webUrl = gameDetail.webUrl;

            // 게임 플레이 방식 파라미터
            gameDetail.method = gameDetail.method.replace('1. ', '1.')
            gameDetail.method = gameDetail.method.replace(' 2.', '\n2.')
            gameDetail.method = gameDetail.method.replace(' 2. ', '\n2.')
            gameDetail.method = gameDetail.method.replace(' 3.', '\n3.')
            gameDetail.method = gameDetail.method.replace(' 3. ', '\n3.')
            gameDetail.method = gameDetail.method.replace(' 4.', '\n4.')
            gameDetail.method = gameDetail.method.replace(' 4. ', '\n4.')
            searchedGame.dataValues.method = gameDetail.method;

            // 유저가 저장한 게임만 리턴
            const savedGame = await Saved.findAll({
                where : {
                    UserIdx: user.UserIdx,
                },
                attributes: ['GameIdx']
            })

            // 전체 후기 가져오기
            const reviews = await Review.findAll({
                attributes: ['GameIdx', 'star']
            })

            // 저장 여부 
            for (j = 0; j < savedGame.length; j++) { 
                if (searchedGame.GameIdx == savedGame[j].GameIdx) {
                    searchedGame.dataValues.saved = 1;
                } else {
                    searchedGame.dataValues.saved = 0;
                }
            }

            var cnt = 0
            // 후기 별점 계산
            for (j = 0; j < reviews.length; j++) { 
                if (searchedGame.GameIdx == reviews[j].GameIdx) {
                    cnt ++
                    searchedGame.dataValues.star = searchedGame.dataValues.star + reviews[j].star
                } 
            }
            if (cnt > 0) {
                searchedGame.dataValues.star =  searchedGame.dataValues.star / cnt
            }
            
            return searchedGame;
        } catch (error) {
            throw error;
        }
    },


    /* 보드게임 후기 조회 GET : [ /review/:gameIdx] */
    getGameReviews: async (UserIdx, GameIdx) => {
        try {
            const user = await User.findOne({
                where: {
                    UserIdx,
                }
            });

            // 각 리뷰 가져오기
            const reviews = await Review.findAll({ 
                where : {
                    GameIdx,
                }, 
                attributes : ['ReviewIdx', 'star', 'keyword', 'createdAt'],

                include: [{
                    model: User,
                    attributes : ['UserIdx', 'nickName', 'level'],
                }]

            });

            // 키워드 배열로 변환
            for (i = 0; i < reviews.length; i++) {
                var res = reviews[i].keyword.split(";");
                reviews[i].keyword = res
            }

            // 총 평점과 키워드 빈도수 계산하기
            var cnt = 0
            var starSum = 0
            var keywordCount = {}

            for (j = 0; j < reviews.length; j++) { 
                cnt ++
                starSum = starSum + reviews[j].dataValues.star
                eachKeyword = reviews[j].dataValues.keyword
                for (i = 0; i < eachKeyword.length; i++) {
                    keywordCount[eachKeyword[i]] = (keywordCount[eachKeyword[i]] + 1) || 1 ;
                }
                    
            }
            const averageStar = Math.round(starSum / cnt * 10) / 10

            // 빈도순으로 소팅해주기
            let sorted = Object.entries(keywordCount).sort((a, b) => b[1] - a[1]);
            var topthree = []
            for(let element of sorted) {
                topthree.push(element[0])
                //console.log(element[0]+ ": " + element[1]);
            }
            var topKeywords = topthree.slice(0, 3)

            const reviewInfo = {
                averageStar,
                topKeywords
            }

            // 유저 정보 파라미터로 추가해주기
            for (j = 0; j < reviews.length; j++) { 
                reviews[j].dataValues.UserIdx = reviews[j].User.UserIdx
                reviews[j].dataValues.nickName = reviews[j].User.nickName
                reviews[j].dataValues.level = reviews[j].User.level
                delete reviews[j].dataValues.User
            }

            const result = {
                reviewInfo,
                reviews
            }
            return result

        } catch (error) {
            throw error;
        }
    },


    
    
    

    

}