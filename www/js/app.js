var app = angular.module('App', [
    'ngRoute',
]);

app.config(function ($routeProvider, $httpProvider) {
    

    $httpProvider.defaults.withCredentials = true;

    $routeProvider
    .when('/', {
        controller: 'homeCtrl',
        templateUrl: 'views/home.html'
    })
    .when('/user', {
        controller: 'userCtrl',
        templateUrl: 'views/user.html',
    })
    .otherwise({redirectTo: '/'});
});

app.run(function () {    
    document.addEventListener('deviceready', function() { });
});


