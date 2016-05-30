angular
.module('FightFederation')
.controller('TournamentsController', TournamentsController);

TournamentsController.$inject = ['User', 'Tournament', '$state', '$stateParams', '$scope'];
function TournamentsController(User, Tournament, $state, $stateParams, $scope){
  var self = this;

  self.tournaments = [];
  self.createTournament = createTournament;
  self.deleteTournament = deleteTournament;

  getTournaments();

  function getTournaments(){
    console.log($scope.$parent.Users.currentUser);
    Tournament.query(function(data){
      console.log(data);
      self.tournaments = data;
    });
  }

  function createTournament(){
    var currentUserId = $scope.$parent.Users.currentUser._id;
    self.tournament.creator = currentUserId;
    self.tournament.players = [];
    self.tournament.players.push(currentUserId);
    // add tournament to database
    Tournament.save({ tournament: self.tournament
    },
    function(data){
      User.addTournament({
        id: currentUserId,
        tournament: data.tournament
      },function(user){
        console.log("user updated", user);
      });
    });
  }

  function deleteTournament(id){
    Tournament.delete({id: id}, function(){
      console.log("It's deleted!");
    });

  }
}
