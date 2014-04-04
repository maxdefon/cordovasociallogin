app.controller('userCtrl',[
    '$scope',
    '$rootScope',
    '$location',

    function ($scope,$rootScope,$location) {                  
        
        var userData = {
            fields: 'id,name,birthday,email,gender,hometown,first_name,last_name,username,verified,albums'
        };
        
                FB.api('/me', userData, function(response) { 
                  $scope.$apply(function(){
                    $scope.infos = response;
                    });    
                    console.log($scope.infos);
                });
                
            
    }
]);