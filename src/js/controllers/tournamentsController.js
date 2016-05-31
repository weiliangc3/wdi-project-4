angular
.module('FightFederation')
.controller('TournamentsController', TournamentsController);

TournamentsController.$inject = ['User', 'Tournament', '$state', '$stateParams', '$scope'];
function TournamentsController(User, Tournament, $state, $stateParams, $scope){
  var self = this;

  self.tournaments = [];
  self.createTournament = createTournament;
  self.deleteTournament = deleteTournament;
  self.tournament = null;
  self.participating = false;
  self.currentUser = $scope.$parent.Users.currentUser;
  console.log(self.currentUser);

  getTournaments();

  if ($stateParams.tournamentId){
    self.user = Tournament.get({ id: $stateParams.tournamentId }, function(res){
      self.tournament = res.tournament;
      console.log(res.tournament);
      console.log(res.tournament.players.indexOf(self.currentUser));
    });
  }

  function getTournaments(){
    Tournament.query(function(data){
      self.tournaments = data;
    });
  }

  function createTournament(){
    var currentUserId = $scope.$parent.Users.currentUser._id;
    self.tournament.creator = currentUserId;
    self.tournament.players = [];
    self.tournament.players.push(currentUserId);
    Tournament.save({ tournament: self.tournament
    },
    function(data){
      User.addTournament({
        id: currentUserId,
        tournament: data.tournament
      },function(user){
        $state.go("tournaments");
      });
    });
  }

  function deleteTournament(id){
    Tournament.delete({id: id}, function(){
      getTournaments();
    });
  }


  // Scroll on Page
  (function (jQuery) {
    jQuery.mark = {
      jump: function (options) {
        var defaults = {
          selector: 'a.scroll-on-page-link'
        };
        if (typeof options == 'string') {
          defaults.selector = options;
        }

        options = jQuery.extend(defaults, options);
        return jQuery(options.selector).click(function (e) {
          var jumpobj = jQuery(this);
          var target = jumpobj.attr('href');
          var thespeed = 1000;
          var offset = jQuery(target).offset().top;
          jQuery('html,body').animate({
            scrollTop: offset
          }, thespeed, 'swing');
          e.preventDefault();
        });
      }
    };
  })(jQuery);


  jQuery(function(){
    jQuery.mark.jump();
  });

}
