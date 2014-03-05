var mongoose = require('mongoose');

var departmentSchema = mongoose.Schema({
  name: String,
  abbreviation: String,
  courses: [{
    classId: String,

    number: String,
    title: String
  }]
});

module.exports = mongoose.model('Department', departmentSchema);
