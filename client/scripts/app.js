'use strict';

angular.module('volunteerEventsApp', ['ui.router','ngResource','ngDialog', 'lbServices'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'HomeController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })

            // route for the aboutus page
            .state('app.aboutus', {
                url:'aboutus',
                views: {
                    'content@': {
                        templateUrl : 'views/aboutus.html',
                        controller  : 'AboutController'
                    }
                }
            })

            // route for the contactus page
            .state('app.contactus', {
                url:'contactus',
                views: {
                    'content@': {
                        templateUrl : 'views/contactus.html',
                        controller  : 'ContactController'
                    }
                }
            })

            // route for the menu page
            .state('app.volunteerevent', {
                url: 'volunteerevent',
                views: {
                    'content@': {
                        templateUrl : 'views/volunteerevent.html',
                        controller  : 'VolunteerEventController'
                    }
                }
            })

            // route for the dishdetail page
            .state('app.volunteereventdetail', {
                url: 'volunteerevent/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/volunteereventdetail.html',
                        controller  : 'VolunteerEventDetailController'
                   }
                }
            })

          // route for the dishdetail page
            .state('app.favorites', {
                url: 'favorites',
                views: {
                    'content@': {
                        templateUrl : 'views/favorites.html',
                        controller  : 'FavoriteController'
                   }
                }
            });



        $urlRouterProvider.otherwise('/');
    })
;
