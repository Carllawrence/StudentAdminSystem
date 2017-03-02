angular.module('starsApp').factory('Event', function ($resource) {
    return $resource('user/events/:eventId', {
      eventId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });