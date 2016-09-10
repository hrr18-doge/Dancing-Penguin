angular.module('crowdcart.auth', [])// make an auth module

.controller('AuthController', function ($scope, $window, $location, Auth) {

  $scope.user = {};
  $scope.user.address = {};
  $scope.user.name = {};

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (data) {
        $window.localStorage.setItem('crowdcarttoken', data.token)
        // saving username to localstorage
        $window.localStorage.setItem('crowdcartuser', data.userid);
        $window.localStorage.setItem('crowdcartuserinfo', data);
        $location.path('/mylists');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (data) {
        $window.localStorage.setItem('crowdcarttoken', data.token);
        // saving username to localstorage
        $window.localStorage.setItem('crowdcartuser', data.userid);
        $location.path('/mylists');
      })
      .catch(function (error) {
        console.error(error);
      });
  };
});

// make and auth controller
// signin - delegate to services to call server
// signup - delegate to services to call server