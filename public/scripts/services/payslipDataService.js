angular.module('starsApp').factory('Payslip', function ($resource) {
    return $resource('user/payslips/:payslipId', {
      payslipId: '@_id'
    }, {
      'update': {
        method: 'PUT'
      }
    });
  })

