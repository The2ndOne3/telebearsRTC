module.exports = function(sequelize, types) {
  return sequelize.define('Section', {
    classID: types.STRING,
    // professor: types.STRING,

    number: types.STRING,
    instructor: types.STRING,
    time: types.STRING,
    location: types.STRING,
    ccn: types.STRING,

    enrollment: types.STRING,
    enrollmentLimit: types.STRING,
    waitlist: types.STRING,
    waitlistLimit: types.STRING,
  });
};
