var mongojs = require('mongojs');
if(process.env.MONGOHQ_URL)
  var mongourl = process.env.MONGOHQ_URL
else
  var mongourl = 'telebearsRTC_larry';
var db = mongojs(mongourl, ['departments']);

module.exports = function(app){
  app.get('/search', function(req, res) {
    if(req.query.q == null){
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
            if(err || !data) console.log('DB error');
            else if (data.length == 0) {
              res.render('search', { title: 'Search results for \''+query+'\'', q: query });
            }
            else
              res.redirect('/'+encodeURIComponent(data[0].abbreviation.toLowerCase()));
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
            if(err || !data) console.log('DB error');
            else if (data.length == 0) {
              res.render('search', { title: 'Search results for \''+query+'\'', q: query });
            }
            else
              res.redirect('/'+encodeURIComponent(data[0].abbreviation.toLowerCase())+'/'+course.toLowerCase());
          }
        );
      }
    }
  });
  app.get('/about', function(req, res) { res.render('about', { title: 'About', semester: process.env.ENROLLMENT_PERIOD })});
  app.get('/contact', function(req, res) { res.render('contact', { title: 'Contact'})});
};
