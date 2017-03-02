'use strict';
/**
 * superController for superuser state
 */
angular.module('starsApp')
  .controller('superController', function ($scope, $state, Notice, $http,$stateParams, AuthService, $timeout,User) {
$scope.users =[];

$scope.update = function(){
 Notice.query(function(result){

$scope.notices = result;
  });
}

$scope.update();

$scope.notify = function(notify) {

var newNotice = new Notice(notify);
 newNotice.$save();
 $scope.notify = '';
 $scope.update();
}

 // remove user locally and remotely
    $scope.removeNotice = function (id) {
      $scope.notices[id].$remove();
      $scope.notices.splice(id, 1);
     };
   
    $scope.saveNotice = function (data,id) {
      angular.extend(data, {id: id});
   $http.put('/user/notices/'+id, data);
    };


  // create a new user locally save it remotely
    $scope.addUser = function (newu) {
      var newUser = new User({
        firstname: newu.firstname,
        lastname: newu.lastname,
        username: newu.email,
        email: newu.email,
        password: newu.password,
        telephone: newu.telephone,
        department: newu.department,
        picUrl:'userprofile.png',
        status: newu.status
      });
      newUser.$save();
      $scope.users.unshift(newUser);
      $scope.newUser = '';
    };
    // remove user locally and remotely
    $scope.removeUser = function (id) {
      $scope.users[id].$remove();
      $scope.users.splice(id, 1);
     };
   
    $scope.saveUser = function (data,id) {
      angular.extend(data, {id: id});
   $http.put('/user/appusers/'+id, data);
    };

 
 User.query(function(response) {
          $scope.users = response;
         
      });
   
  });