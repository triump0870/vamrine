angular.module('vamrine.services', [])
.factory('Projects', function(){
  return {
    all: function() {
      if(window.localStorage['projects']){
        return angular.fromJson(window.localStorage['projects']);
      }
      return [];
    },

    save: function(projects){
      console.log("in save projects",projects);
      window.localStorage['projects'] = angular.toJson(projects);
    },

    // update: function(projects, index) {
    //   console.log($window.localStorage['projects'].get(index));
    //   $window.localStorage.remove(index);
    //   $window.localStorage['projects'] = angular.toJson(projects);
    // },
    
    get: function(projectTitle) {
      console.log("main",window.localStorage['projects']);
      if(window.localStorage['projects']){
        var obj = JSON.parse(window.localStorage['projects']);
        for (i in obj){
          if(obj[i].title === projectTitle){
            return i;
          }
        }
      }
      return null;
      // return obj[this.getLastActiveindex()];
    },

    newProject: function(projectTitle){
      // Add a new project    
      console.log("in newProject", projectTitle);
      return {
        title: projectTitle,
        tasks: []
      };
    },

    remove: function(project) {
      var obj = JSON.parse(window.localStorage['projects']);
      for(i in obj){
        if(obj[i].title === project.title){
          obj.splice(i,1);
        }
      }
      return obj;
    },

    getLastActiveindex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },

    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    },
  }
})