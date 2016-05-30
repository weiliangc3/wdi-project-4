angular
  .module('FightFederation', ['ngResource', 'angular-jwt','ui.router'])
  .constant('API', 'http://localhost:3000/api')
  .config(MainRouter)
  .config(function($httpProvider){
    $httpProvider.interceptors.push("authInterceptor");
  });

MainRouter.$inject = ['$stateProvider','$urlRouterProvider', "$locationProvider"];
function MainRouter($stateProvider, $urlRouterProvider, $locationProvider){
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "../views/statics/home.html",
      onEnter: function(){
        $('.sliding-panel-content,.sliding-panel-fade-screen').removeClass('is-visible');
      }
    })
    .state('login', {
      url: "/login",
      templateUrl: "../views/authentications/login.html",
      onEnter: function(){
        $('.sliding-panel-content,.sliding-panel-fade-screen').removeClass('is-visible');
      }
    })
    .state('register', {
      url: "/register",
      templateUrl: "../views/authentications/register.html",
      onEnter: function(){
        $('.sliding-panel-content,.sliding-panel-fade-screen').removeClass('is-visible');
      }
    })
    .state('users', {
      url: "/users",
      templateUrl: "../views/users/index.html",
      onEnter: function(){
        $('.sliding-panel-content,.sliding-panel-fade-screen').removeClass('is-visible');
      }
    })
    .state('user', {
      url: "/users/:userId",
      templateUrl: "../views/users/show.html",
      controller: "UsersController as profile",
      onEnter: function(){
        $('.sliding-panel-content,.sliding-panel-fade-screen').removeClass('is-visible');
      }
    })
    .state('userEdit', {
      url: "/users/:userId/edit",
      templateUrl: "../views/users/edit.html",
      controller: "UsersController as profile",
      onEnter: function(){
        $('.sliding-panel-content,.sliding-panel-fade-screen').removeClass('is-visible');
      }
    })
    .state('tournaments', {
      url: "/tournaments",
      templateUrl: "../views/tournaments/index.html",
      controller: "TournamentsController as tournaments",
      onEnter: function(){
        $('.sliding-panel-content,.sliding-panel-fade-screen').removeClass('is-visible');
      }
    });

    //For reference I've pased the other solution:
    // controller: function($scope, $stateParams, User) {
    //   User.get({ id: $stateParams.id }, function(res){
    //     $scope.$parent.users.user = res.user;
    //   });
    // }

  $urlRouterProvider.otherwise("/");
}


// Sliding Navigation
$(document).ready(function(){
  $('.sliding-panel-button,.sliding-panel-fade-screen,.sliding-panel-close').on('click touchstart',function (e) {
    $('.sliding-panel-content,.sliding-panel-fade-screen').toggleClass('is-visible');
    e.preventDefault();
  });
});
