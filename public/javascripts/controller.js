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

  $scope.init = function(id, course) {
    $http.get('/api/sections/'+id+'/'+course)
      .success(function(data) {
        $scope.sections = data;
        $scope.loading = false;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  }

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
        if(data.enroll != null) {
          $scope.sections[index].enroll = data.enroll;
          $scope.sections[index].enrollLimit = data.enrollLimit;
          $scope.sections[index].enrollment = data.enroll + '/' + data.enrollLimit;
          if(data.enroll == data.enrollLimit) {
            $scope.sections[index].filled = true;
            $scope.sections[index].hide = $scope.hide;
          }
        }
        if(data.waitlist != null)
          $scope.sections[index].waitlist = data.waitlist + '/' + data.waitlistLimit;
        $scope.sections[index].loading = false;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  }

  $scope.toggleHide = function() {
    angular.forEach($scope.sections, function(section, key) {
      if(section.enroll != null && section.enrollLimit != null && section.enroll == section.enrollLimit) {
        section.hide = !$scope.hide;
      }
    });
  }
});

app.controller('AcctCtrl', function($scope, $http) {
  $scope.noEmail = false;
  $scope.noMobile = false;
  $scope.editing = false;
  $scope.saved = {};
  $scope.noSubscriptions = false;

  $scope.init = function(subscriptions, email, mobile) {
    if(subscriptions.length == 0)
      $scope.noSubscriptions = true;
    else
      $scope.subscriptions = subscriptions;
    $scope.email = email;
    $scope.mobile = mobile;

    if(email == '')
      $scope.noEmail = true;
    if(mobile == '')
      $scope.noMobile = true;


    $scope.saved.email = email;
    $scope.saved.mobile = mobile;
    $scope.saved.noEmail = $scope.noEmail;
    $scope.saved.noMobile = $scope.noMobile;
  }

  $scope.removeSection = function(ccn) {
    angular.forEach($scope.subscriptions, function(subscription, key) {
      if(subscription.ccn == ccn) {
        // Remove from subscription db
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
    $scope.saved.email = $scope.email;
    $scope.saved.mobile = $scope.mobile;
    $scope.saved.noEmail = $scope.noEmail;
    $scope.saved.noMobile = $scope.noMobile;
    $scope.editing = false;
  }

  $scope.cancel = function() {
    $scope.email = $scope.saved.email;
    $scope.mobile = $scope.saved.mobile;
    $scope.noEmail = $scope.saved.noEmail;
    $scope.noMobile = $scope.saved.noMobile;
    $scope.editing = false;
  }
});