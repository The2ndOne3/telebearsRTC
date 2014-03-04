var path = require('path')

  , mongoose = require('mongoose')
  , _ = require('underscore')
  , q = require('q')

  , depts = require(path.join('..', 'data', 'departments-parsed'))
  , sections = require(path.join('..', 'data', 'section-list'))

  , Department = require(path.join('..', 'models', 'Department'))
  , Section = require(path.join('..', 'models', 'Section'));

// Connect.
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/telebearsRTC');

// Clean collections.
var defer = q.defer();
mongoose.connection.collections.departments.drop(function(err) {
  if (err) {
    console.error('Error', err);
    defer.reject(err);
  }
  defer.resolve(1);
});
var defer2 = q.defer();
mongoose.connection.collections.sections.drop(function(err) {
  if (err) {
    console.error('Error', err);
    defer2.reject(err);
  }
  defer2.resolve(2);
});

q.all(defer.promise, defer2.promise).then(function() {
  console.log('Database cleaned.');

  var d1 = q.defer(), d2 = q.defer();

  // Create database of departments.
  Department.create(depts, function(err, depts) {
    if (err) {
      console.error('Error', err);
      d1.reject(err);
    }
    console.log('Departments created.');
    d1.resolve(3);
  });

  // Create database of sections.
  Section.create(sections, function(err, sections) {
    if (err) {
      console.error('Error', err);
      d2.reject(err);
    }
    console.log('Sections created.');
    d2.resolve(4);
  });

  return q.all([d1.promise, d2.promise]);
}).done(function() {
  process.exit();
});

// Export connection.
module.exports = mongoose;
