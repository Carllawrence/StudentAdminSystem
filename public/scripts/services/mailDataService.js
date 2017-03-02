angular.module('starsApp').factory('Mail', function ($resource) {
    return $resource('user/mails/:mailId', {
      mailId: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  })

