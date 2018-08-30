var app = angular.module('MyApp',["ngRoute"]);
app.run(function(){
    console.log("My App is Running!");
});

app.config(function($routeProvider) {    $routeProvider
.when("/", {
        templateUrl : "main.html"
    });
});


app.controller('mainCont', function($scope, $http, $location) {
    console.log("This is Main Controller!");
    
    $scope.load = function () {
        console.log("Load");
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/load'
        }
        $http(req).then(function (result) {
            console.log( "Result : " + JSON.stringify(result));
            if(result.status == 200){
                alert("Success");
                $scope.records = result.data.output;
            }  
            else{
                alert("Error");
                $scope.errormessage = "Unexpected Error Occured! Try again later!";
            }
            
        });
    };
    
    $scope.update = function () {
        console.log("Update");
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/update'
        }
        $http(req).then(function (result) {
            console.log( "Result : " + JSON.stringify(result));
            if(result.status == 200){
                alert("Success");
                $scope.records = result.data.output;
            }  
            else{
                alert("Error");
                $scope.errormessage = "Unexpected Error Occured! Try again later!";
            }
            
        });
    };
    $scope.delete = function () {
        console.log("Delete");
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/delete'
        }
        $http(req).then(function (result) {
            console.log( "Result : " + JSON.stringify(result));
            if(result.status == 200){
                alert("Success");
                $scope.records = result.data.output;
            }  
            else{
                alert("Error");
                $scope.errormessage = "Unexpected Error Occured! Try again later!";
            }
            
        });
    };
    
    
});