var path = require('path')

  , mongoose = require('mongoose')

  , get = require(path.join('..', 'lib', 'get'))
  , Section = require(path.join('..', 'models', 'Section'));

module.exports = function(app){
  app.get('/api/section/:ccn', function(req, res){
    var id = req.params.id
      , course = req.params.course;
    Section.findOne({ccn: req.params.ccn}, function(err, sections) {
      if(err){
        console.error('[API ERROR]', err);
      }
      res.set('Cache-Control','private');
      res.json(sections);
    });
  });

  app.get('/api/sections/:id/:course', function(req, res){
    var id = req.params.id
      , course = req.params.course;
    Section.find({classId: id.toUpperCase() + ' ' + course.toUpperCase()}, function(err, sections) {
      if(err){
        console.error('[API ERROR]', err);
      }
      res.set('Cache-Control','private');
      res.json(sections);
    });
  });

  app.get('/api/enrollment/:ccn', function(req, res) {
    Section.findOne({ccn: req.params.ccn}, function(err, section) {
      if (err){
        console.error('[API ERROR]', err);
      }
      if (section.enrollment.current === 0 &&
          section.enrollment.limit === 0 &&
          section.waitlist.current === 0 &&
          section.waitlist.limit === 0) {
        return get.enrollment(req.params.ccn, function(err, data) {
          section.enrollment = {
            current: data.enroll,
            limit: data.enrollLimit
          };

          section.waitlist = {
            current: data.waitlist,
            limit: data.waitlistLimit
          };

          section.updated = Date.now();

          section.save(function(err) {
            if (err) {
              return console.error('[ERROR] Could not update enrollment', err);
            }
          });

          res.set('Cache-Control','private');
          res.json(section);
        });
      } else {
        res.set('Cache-Control','private');
        res.json(section);
      }
    });
  });
};
