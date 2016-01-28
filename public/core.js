var LowercaseJobs = angular.module('LowercaseJobs', []);



angular.module('LowercaseJobs').factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create user variable
    var user = null;

    // return available functions for use in controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register
    });

    function isLoggedIn() {
        if(user) {
          return true;
        } else {
          return false;
        }
    }

    function getUserStatus() {
      return user;
    }

    function login(username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/login', {username: username, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/logout')
        // handle success
        .success(function (data) {
          user = false;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function register(username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/register', {username: username, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

}]);

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
