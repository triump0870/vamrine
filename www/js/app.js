// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('vamrine', ['ionic','vamrine.controllers', 'vamrine.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

/**
* The Project factory handles saving and loading projects from
* local storage, and also lets us save and load the last active
* Project.
**/

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider){

  $ionicConfigProvider.tabs.position('bottom');
  
  $stateProvider

  .state('tab', {
    cache: false,
    url: "/tab",
    abstract: true,
    templateUrl: 'templates/tabs.html',

    // controller: "TaskCtrl"
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        parent: 'tabs',
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl',
      }
    }
  })

  .state('tab.projects', {
    cache: false,
    url: '/projects',
    views: {
      'tab-projects': {
        templateUrl: 'templates/tab-projects.html',
        controller: 'ProjectCtrl'
      }
    }
  })

  .state('tab.project-detail', {
    cache: false,
    url: '/projects/{title}',
    views: {
      'tab-projects': {
        templateUrl: 'templates/project-detail.html',
        controller: 'ProjectDetailCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get("$state");
    $state.go("tab.dash");
  });

});

