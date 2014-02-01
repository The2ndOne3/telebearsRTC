var semester = process.env.ENROLLMENT_PERIOD || 'Spring 2014';

module.exports = function(app){
  app.get('/about', function(req, res){
    console.log('about triggered');
    res.render('about', {
      title: 'About',
      semester: semester
    });
  });
  app.get('/contact', function(req, res){
    res.render('contact', {
      title: 'Contact'
    });
  });
};
