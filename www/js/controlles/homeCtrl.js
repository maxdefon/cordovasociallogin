app.controller('homeCtrl', [
    '$scope',
    '$rootScope',
    '$location',
    '$q',
    '$http',
    function($scope, $rootScope, $location, $q, $http) {
        $scope.googleapi = {
            setToken: function(data) {
                localStorage.access_token = data.access_token;
                localStorage.refresh_token = data.refresh_token || localStorage.refresh_token;
                var expiresAt = new Date().getTime() + parseInt(data.expires_in, 10) + 60 * 60 * 24 * 3500;
                localStorage.expires_at = expiresAt;        
                var token = data.access_token;
                $scope.googleapi.userInfo(token);
            },
            authorize: function(options) {
                var deferred = $q.defer();
                var authUrl = 'https://accounts.google.com/o/oauth2/auth?scope=' + options.scope + '&response_type=code&client_id=' + options.client_id + '&redirect_uri=' + options.redirect_uri;
                var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

                authWindow.addEventListener('loadstart', callback);
                function callback(e) {
                    var url = (typeof e.url !== 'undefined' ? e.url : e.originalEvent.url);
                    var code = /\?code=(.+)$/.exec(url);
                    var error = /\?error=(.+)$/.exec(url);

                    if (code || error) {
                        authWindow.close();
                    }
                    var params = 'code=' + code[1] +
                            '&client_id=' + options.client_id +
                            '&client_secret=' + options.client_secret +
                            '&redirect_uri=' + options.redirect_uri +
                            '&grant_type=authorization_code';
                    if (code) {
                        $http.post('https://accounts.google.com/o/oauth2/token', params,
                                {headers: {'Content-type': 'application/x-www-form-urlencoded'}
                        }).success(function(data) {
                            $scope.googleapi.setToken(data);
                            deferred.resolve(data);
                        }).error(function(response) {
                            deferred.reject(response);
                        });
                    } else if (error) {
                        deferred.reject({
                            error: error[1]
                        });
                    }
                }
                return deferred.promise;
            },
     userInfo: function(token) {
         $http.get('https://www.googleapis.com/oauth2/v1/userinfo?access_token='+token)
                .success(function(data, status, headers, config){
                    $scope.userInfo = data;
                }).error(function(data, status, headers, config){
                    alert('error');
                });
            }
        };

        $scope.loginFace = function() {

            FB.init({
                appId: '509087139167674',
                nativeInterface: CDV.FB,
            });
            FB.login(null, {scope: 'email'});
        };



        $scope.loginGoogle = function() {

            $scope.infoApp = {
                client_id: '1017368639271-vtdabl32dd7c37c55is9ndh21cqjkg2g.apps.googleusercontent.com',
                client_secret: 'aZJpYk1RFc5I8d5JGXQeA-Ny',
                redirect_uri: 'http://localhost/oauth2callback',
                scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.google.com/m8/feeds/'};

            $scope.googleapi.authorize({
                client_id: $scope.infoApp.client_id,
                client_secret: $scope.infoApp.client_secret,
                redirect_uri: $scope.infoApp.redirect_uri,
                scope: $scope.infoApp.scope
            });
//        $scope.googleapi.getToken({
//            client_id: infoApp.client_id,
//            client_secret: infoApp.client_secret
//        });
//           $scope.authorize =  $scope.googleapi.authorize;
//           $scope.getToken =  $scope.googleapi.getToken;

           //$scope.setToken =  $scope.googleapi.setToken;
        };
            
        

        $rootScope.status = function(response) {
            $scope.error = response;
            alert(response.status);
            if (response.status === 'not_authorized') {
                alert('error');
            } else {
                $location.path('/');
            }
        };

    }
]);