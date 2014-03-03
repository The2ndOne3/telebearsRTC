module.exports = function(sequelize, types) {
  return sequelize.define('Course', {
    number: types.STRING,
    title: types.STRING,
    // professor: types.STRING
  });
};
