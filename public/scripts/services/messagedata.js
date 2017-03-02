angular.module('starsApp').factory('Message', function ($resource) {
    return $resource('user/messages/:messageId', {
      messageId: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  })

