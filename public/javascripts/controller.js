var app = angular.module("enrollmentApp", []);

app.controller('DataCtrl', function($scope, $http) {
  $scope.loading = true;
  $scope.initialized = false;
  $scope.enrollment = true;
  $scope.waitlist = true;

  function responsiveTable(newWidth, oldWidth) {
    if(!$scope.initialized) {
      if(newWidth < 641) {
        $scope.time = false;
        $scope.location = false;
        $scope.instructor = false;
        $scope.updated = false;
      }
      else if(newWidth < 1025) {
        $scope.time = true;
        $scope.location = true;
        $scope.instructor = false;
        $scope.updated = false;
      }
      else {
        $scope.time = true;
        $scope.location = true;
        $scope.instructor = true;
        $scope.updated = true;
      }
      $scope.initialized = true;
    }
    else {
      if(newWidth < 641) {
        if(!(oldWidth < 641)) {
          $scope.time = false;
          $scope.location = false;
          $scope.instructor = false;
          $scope.updated = false;
        }
      }
      else if(newWidth < 1025) {
        if(!(oldWidth < 1025 && oldWidth > 640)) {
          $scope.time = true;
          $scope.location = true;
          $scope.instructor = false;
          $scope.updated = false;
        }
      }
      else {
        $scope.time = true;
        $scope.location = true;
        $scope.instructor = true;
        $scope.updated = true;
      }
    }
  }

  $scope.$watch(
    function() { return $(window).width(); },
    responsiveTable
  );

  $(window).resize(function() {
    $scope.$apply();
  });

  $scope.init = function(id, course, subscriptions) {
    $http.get('/api/sections/'+id+'/'+course)
    .success(function(data) {
      $scope.sections = data;
      $scope.loading = false;

      if(subscriptions.length != 0) {
        for(var i = 0; i < subscriptions.length; i++) {
          angular.forEach($scope.sections, function(section, key) {
            if(subscriptions[i].ccn == section.ccn)
              section.watching = true;
          });
        }
      }
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });
  };

  $scope.loadAllData = function() {
    angular.forEach($scope.sections, function(section, key) {
      var ccn = section.ccn;
      $scope.loadData(key, ccn);
    });
  };

  $scope.loadData = function(index, ccn) {
    $scope.sections[index].loading = true;
    $http.get('/api/enrollment/'+ccn)
      .success(function(data) {
        $scope.sections[index].date = new Date().toLocaleString();
        if(data.enrollment != null) {
          $scope.sections[index].enrollment.current = data.enrollment.current;
          $scope.sections[index].enrollment.limit = data.enrollment.limit;
          if(data.enrollment.current == data.enrollment.limit) {
            $scope.sections[index].filled = true;
            $scope.sections[index].hide = $scope.hide;
          }
        }
        if(data.waitlist != null)
          $scope.sections[index].waitlist.current = data.waitlist.current;
          $scope.sections[index].waitlist.limit = data.waitlist.limit;
        $scope.sections[index].loading = false;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  $scope.toggleHide = function() {
    angular.forEach($scope.sections, function(section, key) {
      if(section.enroll != null && section.enrollLimit != null && section.enroll == section.enrollLimit) {
        section.hide = !$scope.hide;
      }
    });
  };

  $scope.subscribe = function(ccn) {
    $http.post('/subscribe/'+ccn)
    .success(function(data) {
      console.log('Suscribed to section '+ccn);
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });
  }
});

app.controller('AcctCtrl', function($scope, $http) {
  $scope.email = '';
  $scope.mobile = '';
  $scope.noEmail = false;
  $scope.noMobile = false;
  $scope.editing = false;
  $scope.saved = {};
  $scope.noSubscriptions = false;
  $scope.subscriptions = [];

  $scope.init = function(subscriptions, email, mobile) {
    if(subscriptions.length == 0)
      $scope.noSubscriptions = true;
    else {
      for(var i = 0; i < subscriptions.length; i++) {
        $http.get('/api/section/'+subscriptions[i].ccn)
        .success(function(data) {
          $scope.subscriptions.push(data);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
      }
    }
    if(email.length == 0)
      $scope.noEmail = true;
    else
      $scope.email = email[0].address;
    if(mobile.length == 0)
      $scope.noMobile = true;
    else
      $scope.mobile = mobile[0].number;

    $scope.saved.email = $scope.email;
    $scope.saved.mobile = $scope.mobile;
    $scope.saved.noEmail = $scope.noEmail;
    $scope.saved.noMobile = $scope.noMobile;
  }

  $scope.removeSection = function(ccn) {
    angular.forEach($scope.subscriptions, function(subscription, key) {
      if(subscription.ccn == ccn) {
        $http.post('/unsubscribe/'+ccn)
        .success(function(data) {
          console.log('Unsubscribed from section '+ccn);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
        subscription.hide = true;
      }
    });
    $scope.noSubscriptions = true;
    angular.forEach($scope.subscriptions, function(subscription, key) {
      if(!subscription.hide) {
        $scope.noSubscriptions = false;
      }
    });
  }

  $scope.startEditing = function() {
    $scope.editing = true;
  }

  $scope.add = function(type) {
    if(type == 'email')
      $scope.noEmail = false;
    if(type == 'mobile')
      $scope.noMobile = false;
  }

  $scope.remove = function(type) {
    if(type == 'email') {
      $scope.email = '';
      $scope.noEmail = true;
    }
    else if(type == 'mobile') {
      $scope.mobile = '';
      $scope.noMobile = true;
    }
  }

  $scope.save = function() {
    // insert query to save new settings
    saveField('email', $scope.email, $scope.saved.email, $scope.noEmail, $scope.saved.noEmail);
    saveField('mobile', $scope.mobile, $scope.saved.mobile, $scope.noMobile, $scope.saved.noMobile);
    $scope.saved.email = $scope.email;
    $scope.saved.mobile = $scope.mobile;
    $scope.saved.noEmail = $scope.noEmail;
    $scope.saved.noMobile = $scope.noMobile;
    $scope.editing = false;
  }

  function saveField(field, current, saved, non, savedNon, field) {
    if(saved != current) {
      if(non) {
        //api call to delete email
        $http.delete('/account/'+field+'/'+saved)
        .success(function(){
          console.log(field+' deleted successfully');
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
      }
      else if(savedNon) {
        // api call to create email
        $http.post('/account/'+field+'/'+current)
        .success(function(){
          console.log(field+' posted successfully');
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
      }
      else {
        // api call to update email
        $http.put('/account/'+field+'/'+current)
        .success(function(){
          console.log(field+' updated successfully');
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
      }
    }
  }

  $scope.cancel = function() {
    $scope.email = $scope.saved.email;
    $scope.mobile = $scope.saved.mobile;
    $scope.noEmail = $scope.saved.noEmail;
    $scope.noMobile = $scope.saved.noMobile;
    $scope.editing = false;
  }
});