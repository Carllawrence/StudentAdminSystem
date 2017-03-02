angular.module('starsApp').controller('RouteController',
  ['$scope', '$http', '$stateParams', '$location', '$state', 'AuthService',
    function ($scope, $http, $stateParams, $location, $state, AuthService) {
        $http.get('/user/profile')
              .then(function (user) {
               
                if (user.data != '0') {
                  //if user data exists route user to approprate state based on status
                  switch (user.data.status) {
                    case 0:
                      $state.go('application.start');
                      break;
                       case 1:
                      $state.go('application.submitted');
                      break;
                       case 2:
                      $state.go('dashboard.student');
                      break;
                    case 3:
                      $state.go('dashboard.admin');
                      break;
                       case 4:
                      $state.go('dashboard.staff');
                      break;
                    case 5:
                      $state.go('dashboard.superuser');
                  }
                } else {
                  $state.go('login');
                }
              })
    }])
