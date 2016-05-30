angular
.module('FightFederation')
.controller('TournamentsController', TournamentsController);

TournamentsController.$inject = ['$state', '$stateParams', '$scope'];
function TournamentsController($state, $stateParams, $scope){
  var self = this;

  self.tournaments = [];

  function getTournaments(){
    console.log($scope.$parent.Users.currentUser);
    console.log("finding Tourneys");
    Tournament.query(function(data){
      console.log(data);
      self.tournaments = data;
    });
  }

  getTournaments();
}
