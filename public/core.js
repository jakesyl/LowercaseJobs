var LowercaseJobs = angular.module('LowercaseJobs', []);

function mainCtrl($scope, $http) {
  $scope.formData = {};

  $http.get('/api/posts')
    .success(function(data) {
      $scope.listings = data;
      console.log(data);
    });
  };


function panelCtrl($scope, $http) {
  $scope.formData = {};

  $http.get('/api/posts')
      .success(function(data) {
        $scope.listings = data;
      console.log(data);
    });

  $scope.createAdminListing = function() {
    $http.post('api/posts', $scope.formData)
      .success(function(data) {
        $scope.formData = {};
        $scope.listing = data;

      })
      .error(function(data) {
        console.log('Error' + data);
      });

    $http.get('/api/posts')
      .success(function(data) {
        $scope.listings = data;
        console.log(data);
      });
  };

  $scope.deleteAdminListing = function(listingID) {
    $http.delete('/api/posts/' + listingID + '/edit')
      .success(function(data) {
      })
      .error(function(data) {
        console.log('Error' + data);
      });

    $http.get('/api/posts')
      .success(function(data) {
        $scope.listings = data;
        console.log(data);
      });

  };

    $scope.editData = {}

  $scope.editAdminListing = function() {
    $http.put('/api/posts/' + $scope.editData.id + '/edit', $scope.editData)
      .success(function(data){
        $scope.editData = {}
        $scope.listing = data;
        console.log(data);
      })
      .error(function(data) {
        console.log('Error' + data);
      });

      $http.get('/api/posts')
        .success(function(data) {
          $scope.listings = data;
          console.log(data);
        });

  }

};






function editCtrl($scope, $http) {
  $scope.formData = {};


$scope.editAdminListing = function(listingID) {
  $http.put('/api/posts/' + listingID + '/edit', $scope.formData)
    .success(function(data){
      $scope.formData = {};
      $scope.listing = data;
      console.log(data);
    })
    .error(function(data) {
      console.log('Error' + data);
    });

    $http.get('/api/posts')
      .success(function(data) {
        $scope.listings = data;
        console.log(data);
      });

}

};
