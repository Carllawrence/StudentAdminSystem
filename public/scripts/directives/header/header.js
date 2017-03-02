'use strict';
/**
 *Header
 */
angular.module('starsApp')
	.directive('header',function(){
		return {
        templateUrl:'scripts/directives/header/header.html',
        restrict: 'E',
        replace: true,
             controller:function($scope, $rootScope){
              
        switch ($rootScope.currentUser.status) {
                case 0:
                    $scope.topmenu = {"name":"Student Module", "url":"dashboard.student", "icon":"user"};
                  break;
                  case 1:
                    $scope.topmenu = {"name":"Student Module", "url":"dashboard.student", "icon":"user"};
                  break;
                     case 2:
                    $scope.topmenu = {"name":"Student Module", "url":"dashboard.student", "icon":"user"};
                  break;
                case 3:
                  $scope.topmenu = {"name":"Admin Module", "url":"dashboard.admin", "icon":"user"};
                  break;
                case 5:
                   $scope.topmenu = {"name":"System Module", "url":"dashboard.superuser", "icon":"user"};
              }
          }
    	}
	});


