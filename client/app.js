'use strict';

angular.module("myApp",['ui.router'])
.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){

  $stateProvider.state('route1',
  {
    url:'/',
    title:'route1',
    controller:'Route1Ctrl',
    templateUrl:'partials/route1.tpl.html'
  })

  .state('route2',
  {
    url:'/route2',
    title:'route2',
    controller:'Route2Ctrl',
    templateUrl:'partials/route2.tpl.html',
    data: {access: ['admin'] }

  })

  .state('route3',
  {
    url:'/route3',
    title:'route3',
    controller:'Route3Ctrl',
    templateUrl:'partials/route3.tpl.html',
    data: {access: ['admin','user'] }

  })

  .state('login',
  {
    url:'/login',
    title:'login',
    controller:'LoginCtrl',
    templateUrl:'partials/login.tpl.html'
  })

   $urlRouterProvider.otherwise('/');


}])

.controller('MainCtrl',['$scope','$rootScope','$window',function($scope,$rootScope,$window){

  $rootScope.$on("$stateChangeStart",function(event,next){

    if(next.data && !$rootScope.user) {

      $window.alert("Restricted access. Kindly login to access");
      event.preventDefault();

    }
    else if (next.data && $rootScope.user){
      var granted = false;

      angular.forEach(next.data.access,function(accessLevel){
        if($rootScope.user.authority === accessLevel) {
          granted = true;
        }
      });

      if(!granted) {
        $window.alert("You do not have authrozation to access this section");
        event.preventDefault();
      }

    }

  });


  $scope.logout = function(){
    $window.sessionStorage.removeItem('token');
    $rootScope.user = {};
  };

}])

.controller('Route1Ctrl',['$scope',function($scope){


}])

.controller('Route2Ctrl',['$scope','$http',function($scope,$http){

  $http.get('/needAdminLevelInfo',$scope.user)
  .success(function(result){
    $scope.message = result.key;
  })
.error(function(){
  $scope.message = "what just happened";
});


}])

.controller('Route3Ctrl',['$scope','$http',function($scope,$http){

  $http.get('/needUserLevelInfo',$scope.user)
  .success(function(result){
    $scope.message = result.key;
  })
.error(function(){
  $scope.message = "what just happened";
});

}])

.controller('LoginCtrl',['$scope','$location','$http','$rootScope','$window',function($scope,$location,$http,$rootScope,$window){

  $scope.login = function(){

    $http.post('/login',$scope.user)
  .success(function(result){
    $window.sessionStorage.setItem('token',result.token);
    $rootScope.user = result.user;
    $location.path('/');
  })
.error(function(){
  $scope.loginMessag = "Incorrect credentials";
});

}

}])

.factory('TokenAttacher',['$window','$q',function($window,$q){
  return{
    request: function(config){
               if($window.sessionStorage.getItem('token')){
                 config.headers['x-access-token'] = $window.sessionStorage.getItem('token') ;
               }
               return config || $q.when(config);

             }
  };
}])
.factory('FailedAuthenticationInterceptor',['$q','$location',function($q,$location){
  return{
    responseError: function(rejection){
                     if(rejection.status === 401){
                       alert(rejection.data.msg);
                       $location.path('/');
                     }
                     return $q.reject(rejection);
                   }

  };
}])
.config(['$httpProvider',function($httpProvider){
  $httpProvider.interceptors.push('TokenAttacher');
  $httpProvider.interceptors.push('FailedAuthenticationInterceptor');
}]);

