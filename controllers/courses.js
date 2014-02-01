var mongojs = require('mongojs');
var db = mongojs(process.env.MONGOHQ_URL || 'telebearsRTC_larry', ['departments']);

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
      if(err || !department){
        console.log('DB error');
      }
      else if(department.length < 1) {
        res.render('404', { title: 'Errorrrrrrrr'});
      }
      else {
        res.render('course', { title: title, breadcrumbs: breadcrumbs, id: id, course: course });
      }
    });
  });
  app.get('/:id(\\d+)/', function(req, res) {
    var id = req.params.id.toUpperCase();
    var breadcrumbs = [{href: id, val: id}];

    db.departments.find({abbreviation: id}, function(err, department) {
      if(err || !department){
        console.log('DB error');
      }
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
      if(err || !departments){
        console.log('DB error');
      }
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
  app.get('/search', function(req, res) {
    if(!req.query.q){
      res.render('404', { title: 'Errorrrrrrrr'});
    }
    else {
      var query = req.query.q.trim().toUpperCase();
      var separator = query.lastIndexOf(' ');
      var department = query.substring(0, separator);
      var course = query.substring(separator+1);
      if(separator < 0 || !/\d/.test(course)){
        department = query;
      }
      var aliases = { 'BIOE': 'BIO ENG',
                      'CHEME': 'CHM ENG',
                      'CEE': 'CIV ENG',
                      'CS': 'COMPSCI',
                      'EE': 'EL ENG',
                      'E': 'ENGIN',
                      'IEOR': 'IND ENG',
                      'IB': 'INTEGBI',
                      'MSE': 'MAT SCI',
                      'ME': 'MEC ENG',
                      'MCB': 'MCELLBI',
                      'CNM': 'NWMEDIA',
                      'NUCE': 'NUC ENG',
                      'NST': 'NUSCTX',
                      'STATS': 'STAT' };
      if(department in aliases){
        department = aliases[department];
      }

      if(separator < 0 || !/\d/.test(course)) {
        db.departments.find(
          {
            $or: [
              { name: department },
              { abbreviation: department }
            ]
          },
          function(err, data) {
            if(err || !data){
              console.log('DB error');
            }
            else if (data.length === 0) {
              res.render('search', { title: 'Search results for \''+query+'\'', q: query });
            }
            else{
              res.redirect('/'+encodeURIComponent(data[0].abbreviation.toLowerCase()));
            }
          }
        );
      }
      else {
        db.departments.find(
          {
            $or: [
              { name: department },
              { abbreviation: department }
            ],
            'courses.course': course
          },
          function(err, data) {
            if(err || !data){
              console.log('DB error');
            }
            else if (data.length === 0) {
              res.render('search', { title: 'Search results for \''+query+'\'', q: query });
            }
            else{
              res.redirect('/'+encodeURIComponent(data[0].abbreviation.toLowerCase())+'/'+course.toLowerCase());
            }
          }
        );
      }
    }
  });

  app.get('/api/autocomplete', function(req, res) {
    var result = [];
    db.departments.find().sort({name: 1}, function(err, data) {
      if(err || !data){
        console.log('DB error');
      }
      else {
        for(var i = 0; i < data.length; i++) {
          var abb = data[i].abbreviation;
          var aliases = { 'BIO ENG': 'BIOE',
                      'CHM ENG': 'CHEME',
                      'CIV ENG': 'CEE',
                      'COMPSCI': 'CS',
                      'EL ENG': 'EE',
                      'ENGIN': 'E',
                      'IND ENG': 'IEOR',
                      'INTEGBI': 'IB',
                      'MAT SCI': 'MSE',
                      'MEC ENG': 'ME',
                      'MCELLBI': 'MCB',
                      'NWMEDIA': 'CNM',
                      'NUC ENG': 'NUCE',
                      'NUSCTX': 'NST',
                      'STAT': 'STATS' };
          if(abb in aliases) {
            result.push(aliases[abb]);
            for(var j = 0; j < data[i].courses.length; j++) {
              var alias_datum = {};
              var alias_course = aliases[abb] + ' ' + data[i].courses[j].course;
              alias_datum.value = alias_course;
              alias_datum.tokens = alias_course.split(' ');
              result.push(alias_datum);
            }
          }
          result.push(abb);
          for(var k = 0; k < data[i].courses.length; k++) {
            var datum = {};
            var course = abb + ' ' + data[i].courses[k].course;
            datum.value = course;
            datum.tokens = course.split(' ');
            result.push(datum);
          }
        }
        res.json(result);
      }
    });
  });
};
