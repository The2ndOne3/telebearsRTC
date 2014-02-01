var mongojs = require('mongojs');
if(process.env.MONGOHQ_URL)
  var mongourl = process.env.MONGOHQ_URL
else
  var mongourl = 'telebearsRTC_larry';
var db = mongojs(mongourl, ['departments']);

module.exports = function(app){
  app.get('/:id/:course', function(req, res) {
    var id = req.params.id;
    var hrefID = encodeURIComponent(id.toLowerCase());
    var course = req.params.course;
    var courseName = id + ' ' + course;
    var title = courseName.toUpperCase() + ' Enrollment Data';
    var breadcrumbs = [{href: hrefID, val: id}, {href: hrefID+'/'+course, val: course}];

    db.departments.find({
      abbreviation: id.toUpperCase(),
      courses: {
        $elemMatch: {course: course.toUpperCase()}
      }
    }, function(err, department) {
      if(err || !department) console.log('DB error');
      else if(department.length < 1) {
        res.render('404', { title: 'Errorrrrrrrr'});
      }
      else {
        res.render('course', { title: title, breadcrumbs: breadcrumbs, id: id, course: course });
      }
    });
  });
  app.get('/:id', function(req, res) {
    var id = req.params.id.toUpperCase();
    var breadcrumbs = [{href: id, val: id}];

    db.departments.find({abbreviation: id}, function(err, department) {
      if(err || !department) console.log('DB error');
      else if(department.length < 1) {
        res.render('404', { title: 'Errorrrrrrrr'});
      }
      else {
        res.render('department', { title: department[0].name, breadcrumbs: breadcrumbs, id: id, courses: department[0].courses });
      }
    });
  });
  app.get('/', function(req, res) {
    db.departments.find().sort({name: 1}, function(err, departments) {
      if(err || !departments) console.log('DB error');
      else {
        var data = [];
        for(var i = 0; i < departments.length; i++) {
          var abb = departments[i].abbreviation;
          data.push({ name: departments[i].name, abbreviation: abb });
        }

        res.render('index', { title: 'Berkeley real-time course enrollment data', departments: data });
      }
    });
  });
};
