(function() {

  var app = angular.module('githubViewer', []);

  var MainCtrl = function($scope, $http) {

    $scope.greeting = 'Hello from an Angular Controller';
    $scope.showMessage = function(message){
      $scope.last_message = message;
      document.querySelector('#toastMessage').show();
    };

    $scope.updateOffer = function(offer){
      console.log(offer);
      var offerId = offer.offer_id;
      $http.put('http://localhost:3000/api/offers/'+offerId,offer).then(function(response){
        console.log(response);
        $scope.showMessage(response.config.data.offer_id+' : '+response.data.msg);
      });
    };

    $scope.deleteOffer = function(offer){
      console.log(offer);
      var offerId = offer.offer_id;
      $http.delete('http://localhost:3000/api/offers/'+offerId,offer).then(function(response){
        console.log(response);
        $scope.showMessage(response.config.offer_id+' : '+response.data.msg);
        $scope.getOffers();
      });
    };

    $scope.createNewOffer = function(){
      document.querySelector('#dialog2').open();
      $scope.new_offer = {};
    };

    $scope.insertNewOffer = function(){
      console.log($scope.new_offer);
      $http.post('http://localhost:3000/api/offers/',$scope.new_offer).then(function(response){
        console.log(response);
        $scope.showMessage(response.config.data.offer_id+' : '+response.data.msg);
        $scope.getOffers();
      });
    };

    $scope.getOffers = function(){
      var pOffers = $http.get('http://localhost:3000/api/offers');
      pOffers.then(onOffers);
    };

    var onOffers = function(response) {
      $scope.offers = response.data;
    };

    $scope.getOffers();


  };


  app.controller('MainCtrl', MainCtrl);
}());
