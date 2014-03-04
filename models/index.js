if (!global.hasOwnProperty('db')) {
  var Sequelize = require('sequelize')
    , sequelize = null

    , path = require('path')
    , config = process.env;

  if (process.env.HEROKU_POSTGRESQL_BRONZE_URL) {
    var match = process.env.HEROKU_POSTGRESQL_BRONZE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

    sequelize = new Sequelize(match[5], match[1], match[2], {
      dialect:  'postgres',
      protocol: 'postgres',
      port:     match[4],
      host:     match[3],
      logging:  true
    });
  } else {
    sequelize = new Sequelize('telebears-rtc', 'root', config.LOCAL_PASSWORD);
  }

  global.db = {
    Sequelize: Sequelize,
    sequelize: sequelize,

    Department:   sequelize.import(__dirname + '/department'),
    Course:   sequelize.import(__dirname + '/course'),
    Section:   sequelize.import(__dirname + '/section'),
    User:      sequelize.import(__dirname + '/user'),
  };

  global.db.Department.hasMany(global.db.Course);
  global.db.Course.hasMany(global.db.Section);

  global.db.Section.hasMany(global.db.User);
  global.db.User.hasMany(global.db.Section);
}

module.exports = global.db;
