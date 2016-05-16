angular.module('vamrine.services', [])

.factory('Projects', function(){
  var hasProject = function() { 
    if(window.localStorage['projects'])
      {
        return window.localStorage['projects']
      }
    return  [];
  };

  var _project = hasProject();
  return {
    all: function() {
      if(_project !== "undefined" & _project !== "null"){
        return angular.fromJson(_project);
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
    
    get: function(projectTitle) {
      var obj = JSON.parse(_project);
      for (i in obj){
        if(obj[i].title === projectTitle){
          return obj[i];
        }
      }
      return null;
      // return obj[this.getLastActiveindex()];
    },

    newProject: function(projectTitle){
      // Add a new project    
      return {
        title: projectTitle,
        tasks: []
      };
    },

    remove: function(project) {
      var obj = JSON.parse(_project);
      for(i in obj){
        if(obj[i].title === project.title){
          obj.splice(i,1);
        }
      }
      return obj;
    },

    // getLastActiveindex: function() {
    //   return parseInt(window.localStorage['lastActiveProject']) || 0;
    // },

    // setLastActiveIndex: function(index) {
    //   window.localStorage['lastActiveProject'] = index;
    // },

    // remove: function(task){
    //   var obj = JSON.parse(window.localStorage['projects']);
    //   console.log("In remove: ",this.getLastActiveindex());
    //   console.log("The removed task: ", task.title);
    //   for (i in obj[this.getLastActiveindex()].tasks){
    //     if (obj[this.getLastActiveindex()].tasks[i].title==task.title){
    //       obj[this.getLastActiveindex()].tasks.splice(i,1);
    //       console.log("in remove obj:",obj);
    //       this.save(obj);
    //     }
    //   }
    // },
  }
});

// .factory('Show', function($ionicLoading))

