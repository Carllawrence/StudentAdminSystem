angular.module('starsApp').factory('Notice', function ($resource) {
    return $resource('user/notices/:noticeId', {
      noticeId: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  })

