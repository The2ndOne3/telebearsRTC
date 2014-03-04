var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/telebearsRTC');

var departmentSchema = mongoose.Schema({
  name: String,
  abbreviation: String,
  courses: [{
    number: String,
    title: String
  }]
});
