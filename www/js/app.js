// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('vamrine', ['ionic', 'vamrine.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

/**
* The Project factory handles saving and loading projects from
* local storage, and also lets us save and load the last active
* Project.
**/

.factory('Projects', function(){
  return {
    all: function() {
      var projectString = window.localStorage['projects'];
      if(projectString){
        return angular.fromJson(projectString);
      }
      return [];
    },

    save: function(projects){
      console.log(angular.toJson(projects));
      window.localStorage['projects'] = angular.toJson(projects);
    },

    // update: function(projects, index) {
    //   console.log(window.localStorage['projects'].get(index));
    //   window.localStorage.remove(index);
    //   window.localStorage['projects'] = angular.toJson(projects);
    // },
    

    newProject: function(projectTitle){
      // Add a new project
      return {
        title: projectTitle,
        tasks: []
      };
    },


    getLastActiveindex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },

    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    },

    remove: function(task){
      var obj = JSON.parse(window.localStorage['projects']);
      console.log("In remove: ",this.getLastActiveindex());
      console.log("The removed task: ", task.title);
      for (i in obj[this.getLastActiveindex()].tasks){
        if (obj[this.getLastActiveindex()].tasks[i].title==task.title){
          obj[this.getLastActiveindex()].tasks.splice(i,1);
          console.log("in remove obj:",obj);
          this.save(obj);
        }
      }
    },
  }
})

  .config(function($stateProvider, $urlRouterProvider){
    $stateProvider

    .state('index', {
      url: "",
      views: {
        'index': {
          templateUrl: 
        }

      }
      )
  }
  })

