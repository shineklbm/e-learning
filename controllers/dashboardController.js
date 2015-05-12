angular.module('HirealchemyNG')
	.controller('onGoingProjects', function($scope, $http){
		$http.get("data/dashboard/ongoing-projects-list.json")
		.success(function(response) {
			//console.log('Success', response);
			$scope.project = response;
		});
	})
	.controller('openPositions', function($scope, $http){
		$http.get("data/dashboard/open-positions.json")
		.success(function(response) {
			//console.log('Success', response);
			$scope.positions = response;
		});
	})
	.controller('progressList', function($scope, $http){
		$http.get("data/dashboard/progress-list.json")
		.success(function(response) {$scope.progresses = response;});
	})
	.controller('reminderList', function($scope, $http){
		$http.get("data/dashboard/reminder-list.json")
		.success(function(response) {$scope.reminders = response;});
	})
	.controller('pastDueList', function($scope, $http){
		$http.get("data/dashboard/past-due-list.json")
		.success(function(response) {$scope.past_dues = response;});
	})
	.controller('statistics', function($scope, $http){
		$http.get("data/dashboard/statistics.json")
		.success(function(response) {
			console.log('Success', response);
			$scope.statistics = response;
		});
	})
;