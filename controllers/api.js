var cheerio = require('cheerio')
  , request = require('request')

  , config = process.env
  , semester = config.SEMESTER
  , year = config.YEAR;

// id: department abbreviation
// course: course number
// callback: function(err, result){
//  result is array of section objects
// }
var load_section_list = function(id, course, callback){
  var courses = []
    , url = 'http://osoc.berkeley.edu/OSOC/osoc?p_term=' + semester + '&p_course=' + course + '&p_dept=' + id;

  request.get(url, function(error, res, body){
    if(!error && res.statusCode == 200){
      var $ = cheerio.load(body)
        , end = $('table').length - 1;

      $('table').slice(1,end).each(function(){
        var section = $(this).find('tr:nth-of-type(1) td:nth-of-type(3)').text().trim()
          , space = section.lastIndexOf(' ');
        for(var i = 0; i < 2; i++) {
          space = section.lastIndexOf(' ', space-1);
        }
        var section_id = section.substring(space+1)
          , section_index = section.indexOf(course.toUpperCase());
        if(section.charAt(section_index-1) == ' ' && section.charAt(section_index+course.length) == ' '){
          var restrictions = $(this).find('tr:nth-of-type(8) td:nth-of-type(2)').text()
            , location = $(this).find('tr:nth-of-type(2) td:nth-of-type(2)').text();
          if(location != 'CANCELLED' && restrictions != 'CURRENTLY NOT OPEN'){
            var locationArray = location.split(', ');
            courses.push({
              section: section_id,
              instructor: $(this).find('tr:nth-of-type(3) td:nth-of-type(2)').text(),
              time: locationArray[0],
              location: locationArray[1],
              ccn: $(this).find('input[name="_InField2"]').val()
            });
          }
        }
      });
      callback(null, courses);
    }
    else{
      callback(error, null);
    }
  });
};

// ccn: ccn
// callback: function(err, result){
//  result is data object
// }
var load_enrollment_data = function(ccn, callback){
  request.post('https://telebears.berkeley.edu/enrollment-osoc/osc',
    {
      form:{
        _InField1:'RESTRIC',
        _InField2: ccn,
        _InField3: year
      }
    },
    function(error, res, body) {
    if (!error && res.statusCode == 200) {
      var $ = cheerio.load(body)
        , raw_text = $('blockquote:first-of-type div.layout-div').text();
      raw_text = raw_text.replace(/(\r\n|\n|\r)/gm,'')
        .replace(/\s+/g,' ')
        .substring(1);
      var data_array = raw_text.split(' ');
      var enrollData = {
        ccn: parseInt(ccn,10),
        enroll: parseInt(data_array[0],10),
        enrollLimit: parseInt(data_array[8],10),
        waitlist: data_array[21]? parseInt(data_array[10],10) : null,
        waitlistLimit: data_array[21]? parseInt(data_array[21]) : null
      };
      callback(null, enrollData);
    }
    else{
      callback(error, null);
    }
  });
};

module.exports = function(app){
  app.get('/api/sections/:id/:course', function(req, res){
    var id = req.params.id;
    var course = req.params.course;
    load_section_list(id, course, function(err, result){
      if(err){
        console.error('[API ERROR]', err);
      }
      res.set('Cache-Control','private');
      res.json(result);
    });
  });
  app.get('/api/enrollment/:ccn', function(req, res) {
    var ccn = req.params.ccn;
    load_enrollment_data(ccn, function(err, result) {
      if(err){
        console.error('[API ERROR]', err);
      }
      res.set('Cache-Control','private');
      res.json(result);
    });
  });
};
