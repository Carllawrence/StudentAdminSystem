'use strict';

/**
*header notification 
 */
angular.module('starsApp')
	.directive('applicationHeaderNotification',function(){
		return {
        templateUrl:'scripts/directives/applicationheader/application-header-notification/application-header-notification.html',
        restrict: 'E',
        replace: true,
  controller:function($scope, $sce){
		 $scope.htmlPopover = $sce.trustAsHtml('<a ui-sref="logout"><i class="fa fa-sign-out fa-fw"></i> Logout</a>');

		  $scope.dynamicPopover = {
    content: 'Hello, World!',
    templateUrl: 'myPopoverTemplate.html',
    title: 'Title'
  };
	}

		}
	});


