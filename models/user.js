module.exports = function(sequelize, types) {
  return sequelize.define('User', {
    name: {
      type: types.STRING,
      notNull: true,
      notEmpty: true
    },
    password: {
      type: types.STRING,
      notNull: true,
      notEmpty: true
    },

    alertEmail: {
      type: types.BOOLEAN,
      defaultValue: false
    },
    alertText: {
      type: types.BOOLEAN,
      defaultValue: false
    },

    email: {
      type: types.STRING,
      isEmail: true
    },
    phone: {
      type: types.STRING
    },

    // There's no email confirmation token because temporary passwords are sent via email.
    phoneConfirmationToken: types.STRING,

    emailConfirmed: types.BOOLEAN,
    phoneConfirmed: types.BOOLEAN,
  });
};
