// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application', []);

// Angular Controller
app.controller('appController', function($scope, appFactory){

	$("#success_holder").hide();
	$("#success_create").hide();
	$("#error_holder").hide();
	$("#error_query").hide();
	
	$scope.queryAllWine = function(){

		appFactory.queryAllWine(function(data){
			var array = [];
			for (var i = 0; i < data.length; i++){
				parseInt(data[i].Key);
				data[i].Record.Key = parseInt(data[i].Key);
				array.push(data[i].Record);
			}
			array.sort(function(a, b) {
			    return parseFloat(a.Key) - parseFloat(b.Key);
			});
			$scope.all_wine = array;
		});
	}

	$scope.queryWine = function(){

		var id = $scope.wine_id;

		appFactory.queryWine(id, function(data){
			$scope.query_wine = data;

			if ($scope.query_wine == "Could not locate wine"){
				console.log()
				$("#error_query").show();
			} else{
				$("#error_query").hide();
			}
		});
	}

	$scope.recordWine = function(){

		appFactory.recordWine($scope.wine, function(data){
			$scope.create_wine = data;
			$("#success_create").show();
		});
	}

	$scope.changeHolder = function(){

		appFactory.changeHolder($scope.holder, function(data){
			$scope.change_holder = data;
			if ($scope.change_holder == "Error: no wine harvest found"){
				$("#error_holder").show();
				$("#success_holder").hide();
			} else{
				$("#success_holder").show();
				$("#error_holder").hide();
			}
		});
	}

});

// Angular Factory
app.factory('appFactory', function($http){
	
	var factory = {};

    factory.queryAllWine = function(callback){

    	$http.get('/get_all_wine/').success(function(output){
			callback(output)
		});
	}

	factory.queryWine = function(id, callback){
    	$http.get('/get_wine/'+id).success(function(output){
			callback(output)
		});
	}

	factory.recordWine = function(data, callback){

		data.location = data.longitude + ", "+ data.latitude;

		var wine = data.id + "-" + data.location + "-" + data.timestamp + "-" + data.holder + "-" + data.vessel;

    	$http.get('/add_wine/'+wine).success(function(output){
			callback(output)
		});
	}

	factory.changeHolder = function(data, callback){

		var holder = data.id + "-" + data.name;

    	$http.get('/change_holder/'+holder).success(function(output){
			callback(output)
		});
	}

	return factory;
});


