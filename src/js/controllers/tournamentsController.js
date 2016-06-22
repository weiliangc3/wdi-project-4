angular
.module('FightFederation')
.controller('TournamentsController', TournamentsController);

TournamentsController.$inject = ['User', 'Tournament', 'Match', '$state', '$stateParams', '$scope', 'Upload', 'API', 'AWS_URL'];
function TournamentsController(User, Tournament, Match, $state, $stateParams, $scope, Upload, API, AWS_URL){
  var self = this;

  self.createTournament   = createTournament;
  self.deleteTournament   = deleteTournament;
  self.joinTournament     = joinTournament;
  self.confirmPlayer      = confirmPlayer;
  self.openMatchModal     = openMatchModal;
  self.showMatchUpdate    = showMatchUpdate;
  self.updateMatch        = updateMatch;
  self.closeTournament    = closeTournament;
  self.closeRoundRobin    = closeRoundRobin;

  self.tournaments        = [];
  self.tournament         = null;
  self.isInterested       = false;
  self.isParticipating    = false;
  self.isCreator          = false;
  self.currentUserId      = $scope.$parent.Users.currentUser._id;
  self.currentUser        = $scope.$parent.Users.currentUser;
  self.allMatchesPlayed   = false;

  getTournaments();

  if ($stateParams.tournamentId){
    getTournament();
  }

  function getTournament(){
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
      refreshStandings();
      checkMatchesFinished();


      if(!!self.tournament.image){
        $("div.hero").css('background', "url(" + self.tournament.image + ")").css('background-size', "cover");
      }
    });
  }

  function refreshStandings(){
    self.playerStandings = $.extend( true, [], self.tournament.players);
    for (i=0; i<self.playerStandings.length ; i++){
      self.playerStandings[i].points = self.tournament.playerPoints[i];
      self.playerStandings[i].wins   = self.tournament.playerWins[i];
      self.playerStandings[i].losses = self.tournament.playerLosses[i];
      self.playerStandings[i].draws  = self.tournament.playerDraws[i];
    }
    function compare(a,b){
      if (a.points < b.points)
      return 1;
      else if (a.points > b.points)
      return -1;
      else
      return 0;
    }
    self.playerStandings.sort(compare);

    if(!!self.allMatchesPlayed && !self.tournament.open){
    }
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
    self.tournament.playerWins = [0];
    self.tournament.playerLosses = [0];
    self.tournament.playerDraws = [0];
    self.tournament.playerPoints = [0];
    self.tournament.open = true;
    if (!self.tournament.image) self.tournament.image ="/images/leftrite.jpg";
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
      $state.go("tournaments");
    });
  }

  function joinTournament(){
    self.tournament.unconfirmedPlayers.push(self.currentUser);
    Tournament.update({id: self.tournament._id} ,self.tournament, function(data){
      self.isInterested = true;
    });
  }

  function confirmPlayer(id){
    User.get({id: id}, function(res){
      var user = res.user;
      var elementPos = self.tournament.unconfirmedPlayers.map(function(x) {return x._id; }).indexOf(id);
      // var objectFound = self.tournament.unconfirmedPlayers[elementPos];
      // Solution commented for future reference
      self.tournament.unconfirmedPlayers.splice(elementPos, 1);
      self.tournament.players.push(user);
      self.tournament.playerWins.push(0);
      self.tournament.playerLosses.push(0);
      self.tournament.playerDraws.push(0);
      self.tournament.playerPoints.push(0);
      for (i=0;i<(self.tournament.players.length-1);i++){
        self.tournament.matches.push({
          played: false,
          players: [self.tournament.players[i], user]
        });
      }
      self.tournament.allMatchesPlayed = false;
      Tournament.update({id: self.tournament._id} , self.tournament, function(data){
        getTournament();
      });
    });
  }

  function openMatchModal(match, index){
    self.match = match;
    self.matchIndex = index;
    self.showUpdate = false;
    $("#modal-1").prop('checked', true);
  }

  function showMatchUpdate(){
    self.showUpdate = true;
  }

  function updateMatch(){
    if (self.tournament.matches[self.matchIndex].score[0] === undefined){
      self.tournament.matches[self.matchIndex].score[0] = 0;
    }
    if (self.tournament.matches[self.matchIndex].score[1] === undefined){
      self.tournament.matches[self.matchIndex].score[1] = 1;
    }
    self.tournament.matches[self.matchIndex]              = self.match;
    self.tournament.matches[self.matchIndex].played       = true;
    self.tournament.matches[self.matchIndex].recordedBy   = self.currentUser.local.username;
    self.tournament.matches[self.matchIndex].active = false;
    var firstPlayer   = self.tournament.matches[self.matchIndex].players[0];
    var secondPlayer  = self.tournament.matches[self.matchIndex].players[1];
    var playerOnePos  = self.tournament.players.map(function(x) {return x._id; }).indexOf(firstPlayer._id);
    var playerTwoPos  = self.tournament.players.map(function(x) {return x._id; }).indexOf(secondPlayer._id);
    if (self.match.score[0] === self.match.score[1]) {
      self.tournament.playerDraws[playerOnePos]++ ;
      self.tournament.playerDraws[playerTwoPos]++ ;
      self.tournament.playerPoints[playerOnePos]+= 2 ;
      self.tournament.playerPoints[playerTwoPos]+= 2 ;
      self.tournament.matches[self.matchIndex].winner = "no one";
    } else if (self.match.score[0] > self.match.score[1]) {
      self.tournament.playerWins[playerOnePos]++ ;
      self.tournament.playerLosses[playerTwoPos]++ ;
      self.tournament.playerPoints[playerOnePos]+= 4 ;
      self.tournament.playerPoints[playerTwoPos]+= 1 ;
      self.tournament.matches[self.matchIndex].winner = firstPlayer.local.username;
    } else if (self.match.score[0] < self.match.score[1]) {
      self.tournament.playerLosses[playerOnePos]++ ;
      self.tournament.playerWins[playerTwoPos]++ ;
      self.tournament.playerPoints[playerOnePos]+= 1 ;
      self.tournament.playerPoints[playerTwoPos]+= 4 ;
      self.tournament.matches[self.matchIndex].winner = secondPlayer.local.username;
    }

    Tournament.update({id: self.tournament._id} , self.tournament, function(data){
      self.matchesPlayed++;
      refreshStandings();
      checkMatchesFinished();
    });
  }

  function checkMatchesFinished(){
    if (self.matchesPlayed === self.tournament.matches.length){
      self.allMatchesPlayed = true;
      if (self.tournament.open === false) {
        self.tournament.roundRobinFinished = true;
        findWinner();
      }
    }
  }

  function closeTournament(){
    self.tournament.open = false;
    Tournament.update({id: self.tournament._id} , self.tournament, function(data){
      refreshStandings();
      checkMatchesFinished();
    });
  }

  function closeRoundRobin(){
    self.tournament.roundRobinFinished = true;
    // Closes all games
    for (i=0;i<self.tournament.matches.length;i++){
      self.tournament.matches[i].active = false;
    }

    Tournament.update({id: self.tournament._id} , self.tournament, function(data){
      refreshStandings();
      findWinner();
    });
  }

  function findWinner(){
    if (!self.tournament.winner){
      var foundAllFirst = false;
      self.firstPlacePlayers = [];
      self.firstPlacePlayers.push(self.playerStandings[0]);
      var i=1;
      while(foundAllFirst === false && self.firstPlacePlayers.length < self.playerStandings.length){
        if(self.playerStandings[0].points === self.playerStandings[i].points){
          self.firstPlacePlayers.push(self.playerStandings[i]);
        } else {
          foundAllFirst = true;
        }
        i++;
      }

      if (self.firstPlacePlayers.length === 1 ){
        self.tournament.winner = self.firstPlacePlayers[0];
      } else {

        // Makes round robin games for first place players
        for (j=1; j<self.firstPlacePlayers.length; j++){
          for (k=0; k<j;k++){
            self.tournament.matches.push({
              played: false,
              players: [self.firstPlacePlayers[k] , self.firstPlacePlayers[j]]
            });
          }
        }
        self.allMatchesPlayed = false;
      }

      Tournament.update({id: self.tournament._id} , self.tournament, function(data){
        getTournament();
      });
    }
  }

  //
  self.file = null;
  self.files = null;
  self.uploadSingle = uploadSingle;

  function uploadSingle(){
    Upload.upload({
      url: API + '/upload/single',
      data: { file: self.file }
    })
    .then(function(res) {
      if (!self.tournament) self.tournament = {};
      self.tournament.image = AWS_URL + res.data.filename;
    })
    .catch(function(err) {
      console.error(err);
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
