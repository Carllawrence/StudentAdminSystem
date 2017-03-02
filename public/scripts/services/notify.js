angular.module('starsApp').factory('Notify', function ($resource) {
    return $resource('user/notifications/:notifyId', {
      notifyId: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  })

