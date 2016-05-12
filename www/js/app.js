// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('vamrine', ['ionic'])

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
    }
  }
})

.controller('VamCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate, $ionicLoading, filterFilter) {

  console.log("scope projects: ",Projects.all());

  $scope.show = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="android" class="spinner-calm"></ion-spinner>'
    });
  };
  $scope.hide = function() {
    $ionicLoading.hide();
  };

  // Utility function to create a new project from the given projectTitle
  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
  }

  // Load and initialize projects
  $scope.projects = Projects.all();

  // Grab the last active or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveindex()];

  // Call to create a new Project
  $scope.newProject = function(){
    var projectTitle = prompt('Project Name');
    if(projectTitle){
      createProject(projectTitle);
    }
  };

  // Called to select the given project
  $scope.selectProject = function(project, index){
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };
  
  // Create and load the Modal
  $ionicModal.fromTemplateUrl('task.html', function(modal){
    $scope.taskModal = modal;
  },{
    scope: $scope,
    animation: 'slide-in-up'
  });

  // Called when the form is submitted
  $scope.createTask = function(task){
    if(!$scope.activeProject || !task){
      return;
    }

    $scope.activeProject.tasks.push({
      title: task.title,
      checked: false
    });
    $scope.taskModal.hide();
    $scope.show($ionicLoading);

    $timeout(function() {
      $scope.hide($ionicLoading);
    }, 2000);
    // Save all the Projects (inefficient)

    Projects.save($scope.projects);
    task.title = "";
  };

  // $scope.edit = function(task) {
  //   $scope.edittedTask = task;
  //   $scope.originalTask = angular.extend({}, task);
  // }

  // Called when the form is submitted
  $ionicModal.fromTemplateUrl('editTask.html', function(modal){
    $scope.editTaskModal = modal;
  },{
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.saveTask = function(task,index){
    if(!$scope.activeProject || !task){
      return;
    }

    $scope.editTaskModal.hide();

    $scope.show($ionicLoading);

    $timeout(function() {
      $scope.hide($ionicLoading);
    }, 2000);
    // Save all the Projects (inefficient)
    Projects.save($scope.projects);
  };
  // Remove completed task
  $scope.remove = function(task,index){
    console.log("Local Storage: ",localStorage['projects'].indexOf($scope.activeProject));
    console.log("index is: ",index);
    $scope.startFade = true;
    $timeout(function() {
      console.log("length is: ",$scope.activeProject.tasks.length);
      if (!$scope.activeProject.tasks.length <= 1){
        console.log(task);
        $scope.activeProject.tasks.splice(index, 1);
      }
      else{
        console.log("poped item: ",$scope.activeProject.tasks.pop());
        $scope.activeProject.tasks = [];
      }

    },2000);

    console.log("scope projects: ",$scope.projects);
    Projects.save($scope.projects);
  };
  // Open the new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  $scope.editTask = function(task, index) {
    $scope.editTaskModal.show();
    $scope.task = task;
    $scope.index = index;
  };

  $scope.closeEditTask = function() {
    $scope.editTaskModal.hide();
  };

  // Close the task
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  // Toggle the projects
  $scope.toggleProject = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  // Try to create the first project, make sure to defer this by using $timeout
  // so everything is initialized properly
  $timeout(function() {
    if($scope.projects.length == 0){
      while(true){
        var projectTitle = prompt("Your First Project Title: ");
        if (projectTitle){
          createProject(projectTitle);
          break;
        }
      }
    }
  }, 2000);

});

