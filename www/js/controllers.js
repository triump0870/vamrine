angular.module("vamrine.controllers",['vamrine.services','highcharts-ng'])

.filter('capitalize', function() {
	return function(input, all) {
		var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
		return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
	}
})

.service("DataService", function($http, $q){
	this.getData = function(){
		deferred = $q.defer();
		$http({
			method: "GET",
			url: "http://192.168.0.124:8080/WealthWeb/ws/clientOrders/repoRest/repoData4ClientHoldings?id=10_45873BDA8F933E75DD41B29C4267E034BC7E759B31FC97BB350524D1CF32DDD5"
		}).success(function(response){
			deferred.resolve(response);
		}).error(function(error){
			deferred.error(error);
		});
		return deferred.promise;
	}
})

.controller('DashCtrl', function($scope, DataService) {
	DataService.getData().then(function(data){
		console.log(data);
		var sum = 0;
		var ASSET_LIST = [];
		var ITEM_BY_ASSET_FAMILY = [];
		for (var key in data) {
			sum += Math.round(data[key].mktVal);
		}
		for (var key in data){
			var list_obj = {
				name: data[key].assetFamily,
				drilldown: data[key].assetFamily,
				visible: true,
				y: Math.round(data[key].mktVal*100/sum)
			}
			
			var asset_obj = {
				id:data[key].assetFamily,
				name:data[key].assetFamily,
				data: []
			}

			for (var i in data[key].reportCategoryList){
				asset_obj.data.push([data[key].reportCategoryList[i].reportingCategory,Math.round(data[key].reportCategoryList[i].reportCatTotalValue*100/data[key].mktVal)]);
			}

			ITEM_BY_ASSET_FAMILY.push(asset_obj);
			ASSET_LIST.push(list_obj);

		}
		var chartConfig = {
			title: {
				text: 'Portfolio Summary'
			},
			subtitle: {
				text: 'INVESTMENT AT MARKET'
			},

			tooltip: {
				headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
				pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
			},
			options: {
				chart: {
					type: 'pie',
					events: {
						drilldown: function(e) {
							this.setTitle({ text: e.point.name });
						},
						drillup: function(e) {
							this.setTitle({ text: 'Portfolio Summary' });
						}
					},
					plotOptions: {
						pie: {
							size: 100
						}
					},
				},
				drilldown: {
					series: ITEM_BY_ASSET_FAMILY
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
				name: 'Portfolio Summary',
				colorByPoint: true,
				data: ASSET_LIST
			}]
		};
		$scope.chartConfig = chartConfig;
	});
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