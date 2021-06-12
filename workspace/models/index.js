const Sequelize = require('sequelize');
const op = Sequelize.Op;
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Boardgame = require('./boardGame.js')(sequelize, Sequelize);
db.User = require('./user.js')(sequelize, Sequelize);
db.Theme = require('./theme.js')(sequelize, Sequelize);
db.Review = require('./review.js')(sequelize, Sequelize);
db.BoardgameDetail = require('./gameDetail.js')(sequelize, Sequelize);
db.Saved = require('./saved.js')(sequelize, Sequelize);
db.NewGame = require('./newGame.js')(sequelize, Sequelize);
db.NickName = require('./nickName.js')(sequelize, Sequelize);


/* 1: N User:Saved */
db.User.hasMany(db.Saved,{onDelete:'cascade',foreignKey: 'UserIdx',sourceKey:'UserIdx'}) 
db.Saved.belongsTo(db.User,{foreignKey: 'UserIdx',targetKey:'UserIdx'});

/* 1: N User:Saved */
db.User.hasMany(db.NewGame,{onDelete:'cascade',foreignKey: 'UserIdx',sourceKey:'UserIdx'}) 
db.NewGame.belongsTo(db.User,{foreignKey: 'UserIdx',targetKey:'UserIdx'});


/* 1: N User:Review */
// db.User.belongsToMany(db.Review, { through: 'User_Review' });
// db.Review.belongsToMany(db.User, { through: 'User_Review' });

db.User.hasMany(db.Review,{onDelete:'cascade',foreignKey: 'UserIdx',sourceKey:'UserIdx'})
db.Review.belongsTo(db.User,{foreignKey: 'UserIdx',targetKey:'UserIdx'})

/* 1: 1 Boardgame: BoardgameDetail */
db.Boardgame.hasOne(db.BoardgameDetail,{onDelete:'cascade',foreignKey: 'GameIdx',sourceKey:'GameIdx'})
db.BoardgameDetail.belongsTo(db.Boardgame,{foreignKey: 'GameIdx',targetKey:'GameIdx'})

/* 1: N Boardgame:Review */
db.Boardgame.hasMany(db.Review,{onDelete:'cascade',foreignKey: 'GameIdx',sourceKey:'GameIdx'})
db.Review.belongsTo(db.Boardgame,{foreignKey: 'GameIdx',targetKey:'GameIdx'})

/* 1: N Theme: Boardgame */
db.Theme.hasMany(db.Boardgame,{onDelete:'cascade',foreignKey: 'ThemeIdx',sourceKey:'ThemeIdx'})
db.Boardgame.belongsTo(db.Theme,{foreignKey: 'ThemeIdx',targetKey:'ThemeIdx'})

/* 1: 1 Boardgame: Saved */
db.Boardgame.hasOne(db.Saved,{onDelete:'cascade',foreignKey: 'GameIdx',sourceKey:'GameIdx'})
db.Saved.belongsTo(db.Boardgame,{foreignKey: 'GameIdx',targetKey:'GameIdx'})

module.exports = db;
