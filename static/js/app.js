/**
 * Created by mhpandya on 11/17/16.
 */
'use strict';

var app = angular.module('360ViewsFramework', ['ui.router','ngSanitize','ngMaterial','ngAnimate','angular-loading-bar']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url:'/',
            templateUrl: '/static/views/home.html',
            controller: 'MainController'
        })

}]);