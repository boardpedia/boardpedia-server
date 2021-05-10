var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// User
router.use('/user', require('./user'))
// Game
router.use('/game', require('./game'))
// Theme
router.use('/theme', require('./theme'))






module.exports = router;
