var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/telebearsRTC');

var departmentSchema = mongoose.Schema({
  name: String,
  password: String,

  email: String,
  phone: String,

  alerts: {
    text: Boolean,
    email: Boolean
  },

  confirmation: {
    token: String,
    expires: Date
  },

  watching: [{
    ccn: String,
    title: String,
    professor: String,
    time: String
  }]
});
