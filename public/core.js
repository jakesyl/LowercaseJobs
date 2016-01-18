var LowercaseJobs = angular.module('LowercaseJobs', []);

function mainCtrl($scope, $http) {
  $scope.formData = {};

  $http.get('/api/posts')
    .success(function(data) {
      $scope.listings = data;
      console.log(data);
    });


  $scope.createListing = function() {
    $http.post('api/submit', $scope.formData)
      .success(function(data) {
        $scope.formData = {};
        $scope.list = data;
        console.log(data);
        redirect_home($location);
      })
      .error(function(data) {
        console.log('Error' + data);
      });
  };

  };
