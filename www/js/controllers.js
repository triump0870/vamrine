angular.module("vamrine.controllers",[])

.filter('capitalize', function() {
	return function(input, all) {
		var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
		return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
	}
})



.controller('DashCtrl', function($scope) {})

.controller('ProjectDetailCtrl', function($scope, $stateParams, Projects) {
	$scope.activeProject = Projects.get($stateParams.title);
})

.controller("ProjectCtrl", function($scope, Projects, $ionicLoading, $timeout, $ionicModal){

$scope.loading = function() {
	$ionicLoading.show({
		template: '<p>Loading...</p><ion-spinner></ion-spinner>'
	});
};

$scope.hide = function(){
	$ionicLoading.hide();
};

// 	console.log("activeProject: ", $scope.activeProject);
var createProject = function(projectTitle){
	var newProject = Projects.newProject(projectTitle);
	$scope.projects.push(newProject);
	Projects.save($scope.projects);
		// $scope.selectProject(newProject, $scope.projects.length-1);
	}

	$scope.projects = Projects.all();


	$scope.remove = function(project){
		$scope.loading($ionicLoading);
		$scope.projects = Projects.remove(project);
		Projects.save($scope.projects);
		$scope.hide($ionicLoading);
	}

// 	// $scope.activeProject = $scope.projects[Projects.getLastActiveindex()];

$scope.newProject = function() {
	var projectTitle = prompt('Project Name');
	unique = true;
	for (i in $scope.projects){
		console.log("i==:",$scope.projects[i].title);
		if (projectTitle === $scope.projects[i].title){
			unique = false;
			break;
		}
	}
	if(unique){
		createProject(projectTitle);
	}
	else{
		alert('Project name already exist! Try another name.');
	}

};

	// $scope.selectProject = function(project, index) {
	// 	$scope.activeProject = project;
	// 	// Projects.setLastActiveIndex(index);
	// 	// $ionicSideMenuDelegate.toggleLeft(false);
	// };

// 	// Create the task modal
// 	$ionicModal.fromTemplateUrl("templates/new-task.html", function(modal){
// 		$scope.taskModal = modal;
// 	},{
// 		scope: $scope,

// 	});
// 	$scope.createTask = function(task) {
// 		if (!$scope.activeProject || !task){
// 			return;
// 		}
// 		$scope.activeProject.tasks.push({
// 			title: task.title,
// 			checked: false
// 		});

// 		$scope.taskModal.hide();

// 		Projects.save($scope.projects);

// 		task.title = "";
// 	};

// 	$scope.newTask = function() {
// 		$scope.taskModal.show();
// 	};

// 	$scope.closeNewTask = function() {
// 		$scope.taskModal.hide();
// 	};

// 	$scope.toggleProject = function() {
// 		$ionicSideMenuDelegate.toggleLeft();
// 	};

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

})

.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		enableFriends: true
	};
});
