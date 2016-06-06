angular.module("vamrine.controllers",['vamrine.services'])

.filter('capitalize', function() {
	return function(input, all) {
		var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
		return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
	}
})



.controller('DashCtrl', function($scope) {
	/* Chart options */
	$scope.options = pieChartOption();

	/* Chart data */
	$scope.data = dataSource($scope);
})


.controller('ProjectDetailCtrl', function($scope, $stateParams, Projects, $ionicModal, $timeout, $ionicLoading) {
	$scope.loading = function() {
		$ionicLoading.show({
			template: '<ion-spinner icon="android" class="spinner-calm"></ion-spinner>',
			animation: 'fade-in',
			showBackdrop: true,
			maxWidth: 500,
			showDelay: 100
		});
	};

	$scope.hide = function() {
		$ionicLoading.hide();
	};

	$scope.reload = function () {
		$scope.projects = Projects.all();

	}

	$scope.projects = Projects.all();
	var index = Projects.get($stateParams.title);
	$scope.activeProject = $scope.projects[index];
	console.log("in project details, activeProject: ", index,$scope.activeProject);
	console.log("in project details: ", $scope.projects);

	$ionicModal.fromTemplateUrl("templates/new-task.html", function(modal){
		$scope.taskModal = modal;
	},{
		scope: $scope
	})

	$scope.createTask = function(task) {
		if (!$scope.activeProject || !task){
			return;
		}
		console.log("Task is: ",task.title);
		$scope.activeProject.tasks.push({

			title: task.title,
			checked: false
		});

		$scope.projects[index] = $scope.activeProject;
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

	$scope.newField = {};
	$scope.editing = false;
	$scope.editAppKey = function(field) {
		$scope.editing = $scope.activeProject.tasks.indexOf(field);
		$scope.newField = angular.copy(field);
	}

	$scope.saveField = function(task) {
		if ($scope.editing !== false) {
			$scope.activeProject.tasks[$scope.editing] = task;
			$scope.editing = false;
		}
		Projects.save($scope.projects);       
	};
	$scope.cancel = function(index) {
		if ($scope.editing !== false) {
			$scope.activeProject.tasks[$scope.editing] = $scope.newField;
			$scope.editing = false;
		}       
	};

	$scope.remove = function(index){
		$scope.loading();
		$timeout(function() {
			$scope.activeProject.tasks.splice(index,1)
			Projects.save($scope.projects);
			$scope.hide();
		},2000);
	}

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

	$scope.hide = function() {
		$ionicLoading.hide();
	};

// 	console.log("activeProject: ", $scope.activeProject);
var createProject = function(projectTitle){
	var newProject = Projects.newProject(projectTitle);
	$scope.projects.push(newProject);
	console.log("in create projects", $scope.projects);
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
		console.log(projectTitle);
		var unique = true;
		$scope.loading();
		$timeout(function() {
			console.log($scope.projects);
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
}
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

function pieChartOption(){
	return {
		chart: {
			type: 'pieChart',
			height: 500,
			x: function(d){return d.label;},
			y: function(d){return d.value;},
			showLabels: true,
			transitionDuration: 500,
			labelThreshold: 0.01,
			legend: {
				margin: {
					top: 5,
					right: 35,
					bottom: 5,
					left: 0
				}
			}
		}
	}
}

function dataSource($scope, AuthService) {
	// var requestData = {"login":"rakesh","password":"password"};
	// var authReq = $http({
	// 	url: "http://rupeex.com:8081/WealthWeb/ws/login/restLogin",
	// 	method: "POST",
	// 	data: {"login":"rakesh","password":"password"},
	// 	// withCredentials: true,
	// 	headers: {
	// 		'Content-Type': 'application/json; charset=utf-8'
	// 	}
	// });
      // Automatically syncs everywhere in realtime
      // var auth = authReq.then(authSuccess, authFail);
      // console.log("mera value hain",auth.setToken());
      // console.log("mera value hain",auth);
      // $scope.dataRef = request.then(handleSuccess, handleError);
      // console.log("scope",$scope.dataRef);
      
      // $scope.data = $scope.dataRef;


      
  };

//   function authSuccess(response) {
//   	console.log("Auth response", response);
//   	if (response.data.statusCode==200){
//   		return response.data;
//   	}
//   	else { 
//   		return null;
//   	}
//   }

//   function authFail(response){
//   	console.log("Auth Fail", response);
//   	if(!angular.isObject(response.data) ||
//   		! response.data.msg){
//   		return null;
//   }
// }
