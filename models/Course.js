var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/telebearsRTC');

var departmentSchema = mongoose.Schema({
  uid: String,
  sections: [{
    number: String,
    instructor: String,
    time: String,
    location: String,
    ccn: String,

    enrollment: {
      current: Number,
      limit: Number
    },

    waitlist: {
      current: Number,
      limit: Number
    }
  }]
});
