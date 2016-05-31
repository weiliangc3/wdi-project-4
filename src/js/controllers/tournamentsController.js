angular
.module('FightFederation')
.controller('TournamentsController', TournamentsController);

TournamentsController.$inject = ['User', 'Tournament', 'Match', '$state', '$stateParams', '$scope'];
function TournamentsController(User, Tournament, Match, $state, $stateParams, $scope){
  var self = this;

  self.createTournament   = createTournament;
  self.deleteTournament   = deleteTournament;
  self.joinTournament     = joinTournament;
  self.confirmPlayer      = confirmPlayer;
  self.openMatchModal     = openMatchModal;
  self.showMatchUpdate    = showMatchUpdate;
  self.updateMatch        = updateMatch;

  self.tournaments        = [];
  self.tournament         = null;
  self.isInterested       = false;
  self.isParticipating    = false;
  self.isCreator          = false;
  self.currentUserId      = $scope.$parent.Users.currentUser._id;
  self.currentUser        = $scope.$parent.Users.currentUser;

  getTournaments();

  if ($stateParams.tournamentId){
    self.user = Tournament.get({ id: $stateParams.tournamentId }, function(res){
      self.tournament = res.tournament;
      for (i=0; i < self.tournament.players.length; i++){
        if (self.tournament.players[i]._id === self.currentUserId) {
          self.isParticipating  = true;
          self.isInterested     = true;
        }
      }
      for (i=0; i < self.tournament.unconfirmedPlayers.length; i++){
        if (self.tournament.unconfirmedPlayers[i]._id === self.currentUserId) {
          self.isInterested     = true;
        }
      }
      if (self.tournament.creator._id === self.currentUserId){
        self.isCreator = true;
      }

      self.matchesPlayed = 0;
      for (i=0; i < self.tournament.matches.length; i++){
        if (self.tournament.matches[i].played) self.matchesPlayed++;
      }

      console.log(self.tournament);
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

  function joinTournament(){
    self.tournament.unconfirmedPlayers.push(self.currentUser);
    Tournament.update({id: self.tournament._id} ,self.tournament, function(data){
      console.log(data);
      self.isInterested = true;
    });
  }

  function confirmPlayer(id){
    console.log("Confirming!");
    User.get({id: id}, function(res){
      console.log("response is:", res);
      var user = res.user;
      var indexToRemove = self.tournament.unconfirmedPlayers.indexOf(id);
      self.tournament.unconfirmedPlayers.splice(indexToRemove, 1);
      self.tournament.players.push(user);
      for (i=0;i<(self.tournament.players.length-1);i++){
        self.tournament.matches.push({
          played: false,
          players: [self.tournament.players[i], user]
        });
      }
      Tournament.update({id: self.tournament._id} , self.tournament, function(data){
        console.log("Player confirmed.");
      });
    });
  }

  function openMatchModal(match, index){
    self.match = match;
    self.matchIndex = index;
    console.log(match);
    self.showUpdate = false;
    $("#modal-1").prop('checked', true);
  }

  function showMatchUpdate(){
    self.showUpdate = true;
  }

  function updateMatch(){
    console.log("firing");

    self.tournament.matches[self.matchIndex]= self.match;
    self.tournament.matches[self.matchIndex].played = true;
    self.tournament.matches[self.matchIndex].recordedBy = self.currentUser;

    Tournament.update({id: self.tournament._id} , self.tournament, function(data){
      console.log("Attempted Update");
      console.log(self.tournament.matches[self.matchIndex]);
    });

    // Match.get({id: self.match._id}, function(data){
    //   console.log(data);
    // });
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

  // Modal
  $(function() {
    $("#modal-1").on("change", function() {
      if ($(this).is(":checked")) {
        $("body").addClass("modal-open");
      } else {
        $("body").removeClass("modal-open");
      }
    });

    $(".modal-fade-screen, .modal-close").on("click", function() {
      $(".modal-state:checked").prop("checked", false).change();
    });

    $(".modal-inner").on("click", function(e) {
      e.stopPropagation();
    });
  });

}
