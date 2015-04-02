(function(){

  var app = angular.module("githubViewer",[]);

  var MainCtrl = function($scope,$http) {

    $scope.greeting = "Hello from an Angular Controller";

    var onProfileFetch = function(response){
      $scope.profile = response.data;
    };


    var profile_promise = $http.get("https://api.github.com/users/jeevanjoseph");
    profile_promise.then(onProfileFetch);
  };
  app.controller("MainCtrl", MainCtrl);
}());
