'use strict';
/**
 *Header
 */
angular.module('starsApp')
	.directive('applicationheader',function(){
		return {
        templateUrl:'scripts/directives/applicationheader/applicationheader.html',
        restrict: 'E',
        replace: true,
    	}
	});


