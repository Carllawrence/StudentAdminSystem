'use strict';
/**
 * superController for superuser state
 */
angular.module('starsApp')
  .controller('ManageApplicationsController', function ($rootScope, $stateParams, $filter, Upload, $scope, $state, $http, AuthService, $timeout, Application, filterFilter, $location) {

 $scope.appIndex = $stateParams.appIndex;

 $http.get('user/payslips').then( function(result){
 	$scope.payslips = result.data;
 })

  Application.query(function(result){

$scope.allApplications = result; 

var approvedApps = $filter('filter')(result, {status:6});
var submittedApps = $filter('filter')(result, {status:4});


 $scope.labels = ["All", "Submitted", "Approved"];
  $scope.data = [result.length, submittedApps.length, approvedApps.length,0]; 

  });

Application.query($scope.appIndex, function(response){
 
      $scope.application = response[$scope.appIndex];
     
});
 


$scope.decision = function(userId, appid, decision){

	console.log(userId, appid, decision.code, decision.comments);

	if(decision.code == 1) {

	$http.put('/user/appusers/'+ userId, {status:2}); 

	$http.put('/user/applications/'+ userId, {userid: userId, status:6, decision: decision.code, comments: decision.comments, approver: $rootScope.currentUser.username}); 
	
	} else if(decision.code == 3) {

		$http.put('/user/applications/'+ userId, {userid: userId, status:5, decision: decision.code, comments: decision.comments, approver: $rootScope.currentUser.username}); 
	}

	
   $timeout(function() {
$state.go('dashboard.applications');
}, 1000);
}

  });