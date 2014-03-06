var mongoose = require('mongoose');

var sectionSchema = mongoose.Schema({
  ccn: String,
  number: String,
  instructor: String,
  time: String,
  location: String,

  classId: String,

  enrollment: {
    current: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 0
    },
    updated: Number
  },

  waitlist: {
    current: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 0
    },
    updated: Number
  }
});

module.exports = mongoose.model('Section', sectionSchema);
