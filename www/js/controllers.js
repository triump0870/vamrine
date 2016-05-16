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
			template: '<ion-spinner icon="android" class="spinner-calm"></ion-spinner>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 500,
			showDelay: 100
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
}

$scope.projects = Projects.all();


$scope.remove = function(project){
	$scope.loading();
	$timeout(function() {
		$scope.projects = Projects.remove(project);
		Projects.save($scope.projects);
		$scope.hide($ionicLoading);
	},2000);
}

// 	// $scope.activeProject = $scope.projects[Projects.getLastActiveindex()];

$scope.newProject = function() {
	var projectTitle = prompt('Project Name');
	if (projectTitle) {
		var unique = true;
		$scope.loading();
		$timeout(function() {
			for (i in $scope.projects){
				if (projectTitle.toLowerCase() === $scope.projects[i].title.toLowerCase()){
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
			$scope.hide();
		},2000);
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
			$scope.newProject();
			break;
		}

	}

}, 2000);
$scope.hide();

})

.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		enableFriends: true
	};
});
