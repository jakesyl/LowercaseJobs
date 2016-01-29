angular.module('LCJobs').controller('loginController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    console.log(AuthService.getUserStatus());

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
          $location.path('/');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };

}]);

angular.module('LCJobs').controller('logoutController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.logout = function () {

      console.log(AuthService.getUserStatus());

      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/login');
        });

    };

}]);

angular.module('LCJobs').controller('registerController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    console.log(AuthService.getUserStatus());

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };

}]);

angular.module('LCJobs').controller('mainCtrl',
['$scope', '$location', '$http',
function ($scope, $location, $http) {

  $http.get('/api/posts')
    .success(function(data) {
      $scope.listings = data;
      console.log(data);
    });
  }]);



  angular.module('LCJobs').controller('panelCtrl',
  ['$scope', '$location', '$http',
  function ($scope, $location, $http) {

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
    }]);
