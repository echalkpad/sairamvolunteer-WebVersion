'use strict';

angular.module('volunteerEventsApp')

.controller('VolunteerEventController', ['$scope', '$rootScope', 'Volunteerevents', 'Favorites', function ($scope, $rootScope, Volunteerevents, Favorites) {

    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showFavorites = false;
    $scope.showVolunteerEvent = false;
    $scope.message = "Loading ...";

    Volunteerevents.find()
        .$promise.then(
            function (response) {
                $scope.volunteerevents = response;
                $scope.showVolunteerEvent = true;

            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            });

    $scope.select = function (setTab) {
        $scope.tab = setTab;

    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.toggleFavorites = function () {
        $scope.showFavorites = !$scope.showFavorites;
    };

    $scope.addToFavorites = function (volunteereventsId) {
        Favorites.create({
            customerId: $rootScope.currentUser.id,
            volunteereventsId: volunteereventsId
        });
        $scope.showFavorites = !$scope.showFavorites;
    };

}])

.controller('ContactController', ['$scope', function ($scope) {

    $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
    };

    var channels = [{
        value: "tel",
        label: "Tel."
    }, {
        value: "Email",
        label: "Email"
    }];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

    $scope.sendFeedback = function () {


        if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
            $scope.invalidChannelSelection = true;
        } else {
            $scope.invalidChannelSelection = false;
            // feedbackFactory.save($scope.feedback);
            $scope.feedback = {
                mychannel: "",
                firstName: "",
                lastName: "",
                agree: false,
                email: ""
            };
            $scope.feedback.mychannel = "";
            $scope.feedbackForm.$setPristine();
        }
    };
}])

.controller('VolunteerEventDetailController', ['$scope', '$rootScope', '$state', '$stateParams', 'Volunteerevents', 'Comments', function ($scope, $rootScope, $state, $stateParams, Volunteerevents, Comments) {

    $scope.volunteerevent = {};
    $scope.showVolunteerEvent = false;
    $scope.message = "Loading ...";

    $scope.volunteerevent = Volunteerevents.findById({
            id: $stateParams.id
        })
        .$promise.then(
            function (response) {
                $scope.volunteerevent = response;
                $scope.showVolunteerEvent = true;
                $scope.volunteerevent.comments = Volunteerevents.comments({
                    id: $stateParams.id,
                    "filter": {
                        "include": ["customer"]
                    }
                });
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

    $scope.mycomment = {
        rating: 5,
        comment: "",
        volunteereventsId: $stateParams.id,
    };

    $scope.submitComment = function () {

        if ($rootScope.currentUser)
            $scope.mycomment.customerId = $rootScope.currentUser.id;

        Comments.create($scope.mycomment);

        $state.go($state.current, {}, {
            reload: true
        });

        $scope.commentForm.$setPristine();

        $scope.mycomment = {
            rating: 5,
            comment: "",
            volunteereventsId: $stateParams.id,
        };
    }
}])

// implement the IndexController and About Controller here

.controller('HomeController', ['$scope', 'Volunteerevents', 'Leaders', function ($scope, Volunteerevents, Leaders) {
    $scope.showVolunteerEvent = false;
    $scope.showLeader = false;
    $scope.showPromotion = false;
    $scope.message = "Loading ...";
    console.log("Anout to fetch leaders");
    var leadersInfo = Leaders.findOne({
            "filter": {
                "where": {
                    "featured": "true"
                }
            }
        })
        .$promise.then(
            function (response) {
                $scope.leader = response;
                $scope.showLeader = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
    console.log("About to fetch volunteer event")
    $scope.volunteerevent = Volunteerevents.findOne({
            "filter": {
                "where": {
                    "featuredevent": "true"
                }
            }
        })
        .$promise.then(
            function (response) {
                $scope.volunteerevent = response;
                $scope.showVolunteerEvent = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
    /* var promotions = Promotions.findOne({"filter":{"where":{
             "featured": "true"
         }}})
     .$promise.then(
             function (response) {
                 $scope.promotion = response;
                 $scope.showPromotion = true;
             },
             function (response) {
                 $scope.message = "Error: " + response.status + " " + response.statusText;
             }
         );*/
}])

.controller('AboutController', ['$scope', 'Leaders', function ($scope, Leaders) {

    $scope.leaders = Leaders.find();

}])

.controller('FavoriteController', ['$scope', '$rootScope', '$state', 'Favorites', 'Customer', 'Registeredvolunteerevents', function ($scope, $rootScope, $state, Favorites, Customer, Registeredvolunteerevents) {

    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showVolunteerEvent = false;
    $scope.showDelete = false;
    $scope.showDetails=false;
    $scope.message = "Loading ...";
    console.log("Entered FavoriteController.........");


    if ($rootScope.currentUser) {
       console.log("current user = " + JSON.stringify($rootScope.currentUser));
        Customer.favorites({
                id: $rootScope.currentUser.id,
                "filter": {
                    "include": ["volunteerevents"]
                }
            })
            .$promise.then(
                function (response) {
                    $scope.favorites = response;
                    $scope.showVolunteerEvent = true;
                    console.log("Received data for Customer Favorites inside promise");
                    console.log("Favorite info= " + JSON.stringify(response));
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                });
    } else {
        $scope.message = "You are not logged in"
    }

    $scope.select = function (setTab) {
        $scope.tab = setTab;


    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.toggleDelete = function () {
        $scope.showDelete = !$scope.showDelete;
    };

    $scope.deleteFavorite = function (favoriteid) {
        Favorites.deleteById({
            id: favoriteid
        });
        $scope.showDelete = !$scope.showDelete;
        $state.go($state.current, {}, {
            reload: true
        });
    };


    $scope.addToRegisteredVolunteerEvents = function (volunteereventsId, favoriteId) {
        console.log("Entered addToRegisteredEvents");
        console.log("addToRegisteredVolunteerEvents -> currentUserId =" + $rootScope.currentUser.id + "TokenId=" + $rootScope.currentUser.tokenId + " Username= " + $rootScope.currentUser.username);
        console.log("addToRegisteredVolunteerEvents->volunteereventsId" + volunteereventsId);
        Registeredvolunteerevents.create({
            customerId: $rootScope.currentUser.id,
            volunteereventsId: volunteereventsId
        });
        $scope.showRegisteredEvents = !$scope.showRegisteredEvents;
        console.log("Given the Favorite is now added as Registered Event, invoking delete FavoriteId =" + favoriteId);
        Favorites.deleteById({
            id: favoriteId
        });
        $scope.showDelete = !$scope.showDelete;
        $state.go($state.current, {}, {
            reload: true
        });

    };
}])

.controller('RegisteredEventsController', ['$scope', '$rootScope', '$state', 'Favorites', 'Customer', 'Registeredvolunteerevents', function ($scope, $rootScope, $state, Favorites, Customer, Registeredvolunteerevents) {

    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showRegisteredVolunteerDetails = false;
    $scope.showRegisteredVolunteerDelete = false;
    $scope.showRegisteredVolunteerEvent = false;
    $scope.message = "Loading ...";
    console.log("Entered RegisteredEventsController.........");


    if ($rootScope.currentUser) {
        console.log("currentUser =" + JSON.stringify($rootScope.currentUser));

        Customer.registeredvolunteerevents({
                id: $rootScope.currentUser.id,
                "filter": {
                    "include": ["volunteerevents"]
                }
            })
            .$promise.then(
                function (response) {
                    $scope.registeredvolunteerevents = response;
                    $scope.showRegisteredVolunteerEvent = true;

                    console.log("Received data for Customer registeredvolunteerevents inside promise");
                    console.log(JSON.stringify(response));
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                });
    } else {
        $scope.message = "You are not logged in"
    }

    $scope.select = function (setTab) {
        $scope.tab = setTab;


    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };


    $scope.toggleDetails = function () {
        $scope.showRegisteredVolunteerDetails = !$scope.showRegisteredVolunteerDetails;
    };

    $scope.toggleDelete = function () {
        $scope.showRegisteredVolunteerDelete = !$scope.showRegisteredVolunteerDelete;
    };


    $scope.deleteRegisteredVolunteerEvent = function (registeredEventId) {
        console.log("Entered deleteRegisteredVolunteerEvent =" + registeredEventId);
        Registeredvolunteerevents.deleteById({
            id: registeredEventId
        });
        $scope.showRegisteredVolunteerDelete = !$scope.showRegisteredVolunteerDelete;
        $state.go($state.current, {}, {
            reload: true
        });
    };
}])


.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthService', function ($scope, $state, $rootScope, ngDialog, AuthService) {

    $scope.loggedIn = false;
    $scope.username = '';

    if (AuthService.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthService.getUsername();
    }

    $scope.openLogin = function () {
        ngDialog.open({
            template: 'views/login.html',
            scope: $scope,
            className: 'ngdialog-theme-default',
            controller: "LoginController"
        });
    };

    $scope.logOut = function () {
        AuthService.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };

    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthService.isAuthenticated();
        $scope.username = AuthService.getUsername();
    });

    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthService.isAuthenticated();
        $scope.username = AuthService.getUsername();
    });

    $scope.stateis = function (curstate) {
        return $state.is(curstate);
    };

}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthService', function ($scope, ngDialog, $localStorage, AuthService) {

    $scope.loginData = $localStorage.getObject('userinfo', '{}');

    $scope.doLogin = function () {
        if ($scope.rememberMe)
            $localStorage.storeObject('userinfo', $scope.loginData);

        AuthService.login($scope.loginData);

        ngDialog.close();

    };

    $scope.openRegister = function () {
        ngDialog.open({
            template: 'views/register.html',
            scope: $scope,
            className: 'ngdialog-theme-default',
            controller: "RegisterController"
        });
    };

}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthService', function ($scope, ngDialog, $localStorage, AuthService) {

    $scope.register = {};
    $scope.loginData = {};

    $scope.doRegister = function () {

        AuthService.register($scope.registration);

        ngDialog.close();

    };
}]);
