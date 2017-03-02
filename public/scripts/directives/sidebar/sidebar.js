'use strict';

/**
*collapsable sidebar
 */

angular.module('starsApp')
  .directive('sidebar',['$location',function() {
    return {
      templateUrl:'scripts/directives/sidebar/sidebar.html',
      restrict: 'E',
      replace: true,
      scope: {
      },
      controller:function($scope, $rootScope){
        $scope.selectedMenu = 'dashboard';
        $scope.collapseVar = 0;
        $scope.multiCollapseVar = 0;
        
        switch ($rootScope.currentUser.status) {
                case 0:
                    $scope.menus = [{"name":"Courses", "url":"dashboard.student.courses", "icon":"book"},
                  {"name":"Registration","url":"dashboard.student.Registration", "icon":"users"},
                  {"name":"Timetable","url":"dashboard.student.timetable", "icon":"calendar"},
                  {"name":"Grades","url":"dashboard.student.grades", "icon":"check"}];
                  break;
                  case 2:
                    $scope.menus = [{"name":"Courses", "url":"dashboard.student.courses", "icon":"book"},
                  {"name":"Registration","url":"dashboard.student.Registration", "icon":"users"},
                  {"name":"Timetable","url":"dashboard.student.timetable", "icon":"calendar"}];
                  break;
                case 3:
                   $scope.menus = [{"name":"Dashboard", "url":"dashboard.admin", "icon":"bar-chart"},
                   {"name":"Manage Applicants", "url":"dashboard.applications", "icon":"book"},
                     {"name":"Manage Events","url":"dashboard.createEvent", "icon":"calendar"},
                  {"name":"Manage Students","url":"dashboard.manageStudents", "icon":"users"},
                  {"name":"Bank Payments","url":"dashboard.transactions", "icon":"money"}];
                  break;
                case 5:
                  $scope.menus = [{"name":"Manage Users","url":"dashboard.superuser", "icon":"users"},
                  {"name":"Create User", "url":"dashboard.createuser", "icon":"user"},
                   {"name":"Notifications", "url":"dashboard.notifications", "icon":"bell"},
                  {"name":"System Messages", "url":"dashboard.sysMessages", "icon":"envelope"}];
              }
        
        $scope.check = function(x){
          
          if(x==$scope.collapseVar)
            $scope.collapseVar = 0;
          else
            $scope.collapseVar = x;
        };
        
        $scope.multiCheck = function(y){
          
          if(y==$scope.multiCollapseVar)
            $scope.multiCollapseVar = 0;
          else
            $scope.multiCollapseVar = y;
        };
      }
    }
  }]);
