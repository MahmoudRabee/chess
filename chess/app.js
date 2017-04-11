'use strict';
////////
angular.module('myApp', [
  'ngRoute',
  'myApp.view',
  'myApp.version',
  'myApp.services',
  'myApp.classes',
  'myApp.directives'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view'});
}]);
var Classes = angular.module('myApp.classes', []);
var Services = angular.module('myApp.services', []);
var Directives = angular.module('myApp.directives', []);
