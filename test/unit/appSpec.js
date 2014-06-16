'use strict';

describe('MainCtrl',function(){
  var mockEvents = {};
   var scope,$controllerConstructor;

   beforeEach(module('myApp'));

   beforeEach(inject(function($controller,$rootScope){
     scope = $rootScope.$new();
     $controllerConstructor = $controller;
   }));

  it('should blah blah',function(){

   var ctrl = $controllerConstructor("MainCtrl",
     {$scope:scope,$rootScope:{},$window:{} });

    expect(scope.events).toBe(mockEvents);
  });

});
