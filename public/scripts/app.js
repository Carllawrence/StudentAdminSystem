'use strict';
/*
 * Main module(must be loaded first)
 */
//load angular dependencies
angular
  .module('starsApp', [
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'ngFileUpload',
    'ngMessages',
    'xeditable',
  ])

//starts application
  .run(function ($rootScope, $state, AuthService, $http, editableOptions) {

     editableOptions.theme = 'bs3';
     
//when route changes do the following
    $rootScope.$on('$stateChangeStart',
      function (e, toState, toParams, fromState, fromParams) {
        AuthService.getUserStatus().then(function () {
            if (toState.access.restricted == true && AuthService.isLoggedIn() == false) {
              $state.go('login', { reload: true });
            } else if (toState.access.restricted == true && AuthService.isLoggedIn() == true && $rootScope.userStatus < toState.access.status) {

              $state.go('notauth', { reload: true })
            }
          });
      });
  })
  .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

    $ocLazyLoadProvider.config({
      debug: false,
      events: true,
    })

    $urlRouterProvider.otherwise('/');

     $stateProvider
 .state('parent', {
        controller: 'RouteController',
        template: '<div class="loader"><div>',
        url: '/',
        access: { restricted: false, status: 0 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/route.js'
                ]
              })
          }}

      })

       .state('login', {
        controller: 'loginController',
        templateUrl: 'views/pages/login.html',
        url: '/login',
        access: { restricted: false, status: 0 },

      })

      .state('application', {
        url: '/application',
        controller: 'ApplicationsController',
        templateUrl: 'views/application/homeone.html',
        access: { restricted: true, status: 0 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/services/appDataService.js',
                'scripts/services/userCRUD.js',
                'scripts/services/payslipDataService.js',
                  'scripts/controllers/application.js',
                   'scripts/directives/applicationheader/applicationheader.js',
                  'scripts/directives/applicationheader/application-header-notification/application-header-notification.js'
                ]
              }),
              $ocLazyLoad.load(
                {
                  name: 'ngResource',
                  files: ['bower_components/angular-resource/angular-resource.js']
                }),
               $ocLazyLoad.load(
                {
                  name: 'angular-sortable-view',
                  files: ['bower_components/angular-sortable-view/src/angular-sortable-view.js']
                }),
               $ocLazyLoad.load(
                {
                  name: 'mgo-angular-wizard',
                  files: ['bower_components/angular-wizard/dist/angular-wizard.js',
                  'bower_components/angular-wizard/dist/angular-wizard.css']
                })
          }
        }
      })
      

      .state('application.start', {
        url: '/start',
        controller: 'ApplicationsController',
        templateUrl: 'views/application/start.html',
        access: { restricted: true, status: 0 },
      })

       .state('application.applicationForm', {
        url: '/applicationForm',
        controller: 'ApplicationsController',
        templateUrl: 'views/application/applicationForm.html',
        access: { restricted: true, status: 0 },
      })

.state('application.appwizard', {
        url: '/appwizard',
        controller: 'ApplicationsController',
        templateUrl: 'views/application/appwizard.html',
        access: { restricted: true, status: 0 },
      })

       
.state('application.uploadDocs', {
        url: '/uploadDocs',
        controller: 'ApplicationsController',
        templateUrl: 'views/application/uploadDocs.html',
        access: { restricted: true, status: 0 },
      })

      .state('application.paySubmit', {
        url: '/paySubmit',
        controller: 'ApplicationsController',
        templateUrl: 'views/application/paySubmit.html',
        access: { restricted: true, status: 0 },
      })


.state('application.submitted', {
        url: '/submitted',
        controller: 'ApplicationsController',
        templateUrl: 'views/application/submitted.html',
        access: { restricted: true, status: 1 },
       })

        .state('dashboard.userProfile', {
        templateUrl: 'views/pages/userProfile.html',
        controller: 'loginController',
        url: '/userProfile',
        access: { restricted: true, status: 0 },
      })


        .state('dashboard.notices', {
        templateUrl: 'views/pages/notices.html',
        controller: 'MainCtrl',
        url: '/notices',
        access: { restricted: true, status: 0 },
      })


      .state('logout', {
        url: '/logout',
        controller: 'logoutController',
        access: { restricted: true, status: 0 }
      })

       .state('notauth', {
        controller: 'loginController',
        templateUrl: 'views/pages/notauth.html',
        url: '/notauth',
        access: { restricted: false, status: 0 }
      })

      .state('forgot', {
        url: '/forgot',
        templateUrl: 'views/pages/forgot.html',
        controller: 'loginController',
        access: { restricted: false, status: 0 },
      })

      .state('resetform', {
        url: '/resetform/:uuid',
        templateUrl: 'views/pages/resetform.html',
        controller: 'loginController',
        access: { restricted: false, status: 0 },
      })

      .state('reset', {
        url: '/reset',
        templateUrl: 'views/pages/resetform.html',
        controller: 'loginController',
        access: { restricted: false, status: 0 },
      })

      .state('dashboard', {
        url: '/dashboard',
        controller: 'MainCtrl',
        templateUrl: 'views/dashboard/main.html',
        access: { restricted: true, status: 0 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: [
                  'scripts/controllers/main.js',
                  'scripts/directives/header/header.js',
                  'scripts/directives/header/header-notification/header-notification.js',
                  'scripts/directives/sidebar/sidebar.js',
                  'scripts/services/userCRUD.js',
                  'scripts/services/notifyDataService.js',
                  'scripts/services/mailDataService.js',
                  'scripts/directives/sidebar/sidebar-search/sidebar-search.js'
                ]
              }),
              $ocLazyLoad.load(
                {
                  name: 'toggle-switch',
                  files: ["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                    "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                  ]
                }),
              $ocLazyLoad.load(
                {
                  name: 'ngAnimate',
                  files: ['bower_components/angular-animate/angular-animate.js']
                }),
              $ocLazyLoad.load(
                {
                  name: 'ngCookies',
                  files: ['bower_components/angular-cookies/angular-cookies.js']
                }),

              $ocLazyLoad.load(
                {
                  name: 'ngResource',
                  files: ['bower_components/angular-resource/angular-resource.js']
                }),
             
               $ocLazyLoad.load(
                {
                  name: 'chart.js',
                  files: [
                  'bower_components/angular-chart.js/dist/angular-chart.min.js'
                  ]
                }),
              $ocLazyLoad.load(
                {
                  name: 'ngTouch',
                  files: ['bower_components/angular-touch/angular-touch.js']
                })
          }
        }
      })

      .state('dashboard.applications', {
        url: '/applications',
        controller: 'ManageApplicationsController',
        templateUrl: 'views/dashboard/admin/applications.html',
        access: { restricted: true, status: 3 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/services/appDataService.js',
                  'scripts/controllers/manageApplications.js'
                ]
              })
          }
        }
      })

.state('dashboard.notifications', {
        url: '/notifications',
        controller: 'superController',
        templateUrl: 'views/dashboard/superuser/notifications.html',
        access: { restricted: true, status: 5 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: [
                
                  'scripts/controllers/super.js'
                ]
              })
          }
        }
      })

.state('dashboard.messages', {
        url: '/messages',
        controller: 'MessagesController',
        templateUrl: 'views/dashboard/messages.html',
        access: { restricted: true, status: 0 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/services/messagedata.js',
                  'scripts/controllers/messages.js'
                ]
              })
          }
        }
      })

.state('dashboard.sysMessages', {
        url: '/sysMessages',
        controller: 'superController',
        templateUrl: 'views/dashboard/superuser/sysMessages.html',
        access: { restricted: true, status: 5},
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: [ 'scripts/controllers/super.js'
                ]
              })
          }
        }
      })

 .state('dashboard.applicationDetail', {
        url: '/applications/:appIndex',
        controller: 'ManageApplicationsController',
        templateUrl: 'views/dashboard/admin/applicationDetail.html',
        access: { restricted: true, status: 3 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/services/appDataService.js',
                  'scripts/controllers/manageApplications.js'
                ]
              })
              
          }
        }
      })

      .state('dashboard.student', {
        url: '/student',
        controller: 'MainCtrl',
        templateUrl: 'views/dashboard/student/home.html',
        access: { restricted: true, status: 2 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/main.js'
                ]
              })
          }
        }
      })

       .state('dashboard.mail', {
        url: '/mail',
        controller: 'MainCtrl',
        templateUrl: 'views/pages/mail.html',
        access: { restricted: true, status: 0 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/main.js'
                ]
              })
          }
        }
      })

         .state('dashboard.manageStudents', {
        url: '/manageStudents',
        controller: 'AdminController',
        templateUrl: 'views/dashboard/admin/manageStudents.html',
        access: { restricted: true, status: 3 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: [ 
                'scripts/controllers/admin.js'
                ]
              })
          }
        }
      })

       .state('dashboard.transactions', {
        url: '/transactions',
        controller: 'ManageApplicationsController',
        templateUrl: 'views/dashboard/admin/trans.html',
        access: { restricted: true, status: 3 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                 files: ['scripts/services/appDataService.js',
                  'scripts/controllers/manageApplications.js'
                ]
              })
          }
        }
      })

      .state('dashboard.admin', {
        url: '/admin',
        controller: 'ManageApplicationsController',
        templateUrl: 'views/dashboard/admin/home.html',
        access: { restricted: true, status: 3 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/manageApplications.js',
                'scripts/services/appDataService.js'
                ]
              })
          }
        }
      })

       .state('dashboard.createEvent', {
        url: '/createEvent',
        controller: 'EventsController',
        templateUrl: 'views/dashboard/admin/createEvent.html',
        access: { restricted: true, status: 0 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/services/eventDataService.js',
                'scripts/controllers/events.js'
                ]
              })
          }
        }
      })

      .state('dashboard.superuser', {
        url: '/superuser',
        controller: 'superController',
        templateUrl: 'views/dashboard/superuser/home.html',
        access: { restricted: true, status: 4 },
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/super.js',
                 
                  'scripts/services/eventDataService.js']
              })
          }
        }
      })

      .state('dashboard.createuser', {
        controller: 'superController',
        templateUrl: 'views/dashboard/superuser/createUser.html',
        url: '/createuser',
        access: { restricted: true, status: 4 },
          resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/super.js'            

                ]
              })
          }
        }
      })

       .state('dashboard.edituser', {
        controller: 'superController',
        templateUrl: 'views/dashboard/superuser/editUser.html',
        url: '/edituser/:id',
        access: { restricted: true, status: 4 },
          resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'starsApp',
                files: ['scripts/controllers/super.js',
                 
                ]
              })
          }
        }
      })

      .state('dashboard.changepass', {
        url: '/changepassword',
        templateUrl: 'views/dashboard/changepass.html',
        controller: 'loginController',
        access: { restricted: true, status: 0 },
      })

  }]);