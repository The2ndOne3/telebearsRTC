module.exports = function(sequelize, types) {
  return sequelize.define('Department', {
    name: types.STRING
  });
};
