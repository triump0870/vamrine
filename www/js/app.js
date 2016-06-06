// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('vamrine', ['ionic','nvd3','vamrine.controllers'])
.run(function($ionicPlatform, $http, $q) {
  var _baseUrl = "http://localhost:8080/WealthWeb/ws/";
  var _loginUrl = "login/restLogin";
  var _data = {"login":"rakesh","password":"password"};
  var _finalUrl = '';
  var _authData = '';
  var LOCAL_TOKEN_KEY = "JSESSIONID";
  var _makeUrl = function() {
    _finalUrl = _baseUrl+_loginUrl;
    return _finalUrl;
  }
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

    var req = function(){
      _makeUrl();
      var deferred = $q.defer();
      $http({
        method:"POST",
        url: _finalUrl,
        data: _data,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).success(function(data){
        deferred.resolve(data);
      }).error(function(){
        deferred.reject("An unknown error occured");
      })
      return deferred.promise;
    }
    req().then(function(data){
      window.localStorage.setItem(LOCAL_TOKEN_KEY, data.msg);
    },
    function(reason){
      window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    })
  })
})
/**
* The Project factory handles saving and loading projects from
* local storage, and also lets us save and load the last active
* Project.
**/

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider){

  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.headers.common['X-Auth-Token'] = window.localStorage.getItem("JSESSIONID");
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
  });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});

