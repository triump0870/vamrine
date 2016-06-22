TREND_LIST = [{
	drilldown: "Trend1",
	name: "Trend1",
	visible: true,
	y: 12
}, {
	drilldown: "Trend2",
	name: "Trend2",
	visible: true,
	y: 13
}, {
	drilldown: "Trend3",
	name: "Trend3",
	visible: true,
	y: 25
}, {
	drilldown: "Trend4",
	name: "Trend4",
	visible: true,
	y: 50
}]

NUMBER_OF_OFFERS_BY_TREND = [{
	id: "Trend1",
	name: "Trend1",
	data: [
	["Offer1", 50],
	["Offer2", 30],
	["Offer3", 20]
	]
}, {
	id: "Trend2",
	name: "Trend2",
	data: [
	["Offer3", 20],
	["Offer4", 10],
	["Offer5", 40],
	["Offer6", 30]
	]
}, {
	id: "Trend3",
	name: "Trend3",
	data: [
	["Offer7", 70],
	["Offer8", 30]
	]
}, {
	id: "Trend4",
	name: "Trend4",
	data: [
	["Offer9", 15],
	["Offer10", 35],
	["Offer11", 20],
	["Offer12", 30]
	]
}]

angular.module("vamrine.controllers",['vamrine.services','highcharts-ng'])

.filter('capitalize', function() {
	return function(input, all) {
		var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
		return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
	}
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
})

.controller('DashCtrl', function($scope) {
	var chartConfig = {
		title: {
			text: 'Number of offers by trend'
		},
		subtitle: {
			text: 'My company'
		},

		tooltip: {
			headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
			pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
		},
		options: {
			chart: {
				type: 'pie'
			},
			drilldown: {
				series: NUMBER_OF_OFFERS_BY_TREND
			},
			legend: {
				align: 'right',
				x: -70,
				verticalAlign: 'top',
				y: 20,
				floating: true,
				backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
				borderColor: '#CCC',
				borderWidth: 1,
				shadow: false
			},
			tooltip: {
				headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
				pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
			}
			
		},
		series: [{
			name: 'Trends',
			colorByPoint: true,
			data: TREND_LIST
		}]
	};
	$scope.chartConfig = chartConfig;

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
