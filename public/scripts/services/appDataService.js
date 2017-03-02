angular.module('starsApp').factory('Application', function ($resource) {
    return $resource('user/applications/:userid', {
      userid: '@userid'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  });

  angular.module('starsApp').factory('newApp', function ($resource) {
    return $resource('user/applications/:applicationId', {
      applicationId: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  });
