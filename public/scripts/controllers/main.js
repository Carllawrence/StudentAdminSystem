'use strict';
/**
 * MainCtrl
 */
angular.module('starsApp')
  .controller('MainCtrl', function($rootScope,Notice, $filter, User, Mail, $scope,$state,$http,AuthService) {

     

$http.get('/assets/rwandaData.json').then(function(result){
  $scope.rwandaAddress = result.data;
});

$scope.personalInfo = {address: {Province:$rootScope.currentUser.Province, District: $rootScope.currentUser.District, Sector:$rootScope.currentUser.Sector, Cellule:$rootScope.currentUser.Cellule, Village:$rootScope.currentUser.Village},
telephone: {number:$rootScope.currentUser.telephone}};

  
$scope.saveUser = function () {
      
  $http.put('/user/appusers/'+ $rootScope.currentUser._id, $scope.personalInfo.address);
    };



$scope.labels = ["Courses", "GPA", "Year"];
  $scope.data = [3, 5, 2];

   Notice.query(function(result){

$scope.notices = result;
 $rootScope.howManyNotices = result.length;
  });

    $scope.update = function() {

  Mail.query(function(response) {
         
         var inbox = $filter('filter')(response, {toid:$rootScope.currentUser._id});
         var sent = $filter('filter')(response, {fromid:$rootScope.currentUser._id});
         console.log(inbox, sent);
          $scope.inboxMails = inbox;
          $scope.sendMails = sent;
           $rootScope.howManyMsg = inbox.length;
            

      });
 }


$scope.update();

$scope.deleteInboxMsg = function(index){
  $scope.inboxMails[index].$delete();
  $scope.inboxMails.splice(index, 1);
  $scope.update();
}

   $scope.sendMessage = function(data){
console.log(data.to._id);

var newMessage = new Mail({fromid:$rootScope.currentUser._id, toid:data.to._id, fromname:$rootScope.currentUser.firstname, 
	toname:data.to.firstname, subject:data.subject, message: data.message })
newMessage.$save( function(response){
  $scope.mail= '';
  $('#myModal').modal('hide');
$scope.update();
});
   }


 User.query(function(response) {
          $scope.users = response;
         
      });



  });
