angular.module("vamrine.controllers",[])

.controller("TaskCtrl", function($scope, Projects, $ionicSideMenuDelegate, $timeout, $ionicModal){
	var createProject = function(projectTitle){
		var newProject = Projects.newProject(projectTitle);
		$scope.projects.push(newProject);
		Projects.save();
		$scope.selectProject(newProject, $scope.projects.length-1);
	}

	$scope.projects = Projects.all();

	$scope.activeProject = $scope.projects[Projects.getLastActiveindex()];

	$scope.newProject = function() {
		var projectTitle = prompt('Project Name');
		if (projectTitle in $scope.projects){
			window.alert('Project name already exist! Try another name.');
		}
		else if (projectsTitle){
			createProject(projectTitle);
		}
	};

	$scope.selectProject = function(project, index) {
		$scope.activeProject = project;
		Projects.setLastActiveIndex(index);
		$ionicSideMenuDelegate.toggleLeft(false);
	};

	// Create the task modal
	$ionicModal.fromTemplateUrl("templates/new-task.html", function(modal){
		$scope.taskModal = modal;
	},{
		scope: $scope,

	});
	$scope.createTask = function(task) {
		if (!$scope.activeProject || !task){
			return;
		}
		$scope.activeProject.tasks.push({
			title: task.title,
			checked: false
		});

		$scope.taskModal.hide();

		Projects.save($scope.projects);

		task.title = "";
	};

	$scope.newTask = function() {
		$scope.taskModal.show();
	};

	$scope.closeNewTask = function() {
		$scope.taskModal.hide();
	};

	$scope.toggleProject = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};

	$timeout(function(){
		if($scope.projects.length == 0){
			while(true){
				var projectTitle = prompt("Enter your First Project Title");
				if (projectTitle){
					createProject(projectTitle);
					break;
				}
			}
		}
	}, 2000);

});
