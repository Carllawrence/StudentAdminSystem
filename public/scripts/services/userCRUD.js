angular.module('starsApp').factory('User', function ($resource) {
    return $resource('user/appusers/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });