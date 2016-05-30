var Tournament = require("../models/tournament");
var User = require("../models/user");

function tournamentIndex(req, res){
  Tournament.find({}, function(err, tournament) {
    if (err) return res.status(404).json(err);
    res.status(200).json({ tournament: tournament });
  });
}

function tournamentCreate(req, res){
  var tournament = new Tournament(req.body.tournament);
  tournament.save(function(err, tournament){
    if (err) return res.status(500).json(err);
    res.status(201).json({ tournament: tournament });
  });
}

function tournamentShow(req, res){
  var id = req.params.id;

  Tournament.findById({ _id: id }, function(err, tournament) {
    if (err) return res.status(500).json(err);
    if (!tournament) return res.status(404).json(err);
    res.status(200).json({ tournament: tournament });
  });
}

function tournamentUpdate(req, res){
  var id = req.params.id;

  Tournament.findByIdAndUpdate({ _id: id }, req.body, function(err, tournament){
    if (err) return res.status(500).json(err);
    if (!tournament) return res.status(404).json(err);
    res.status(200).json({ tournament: tournament });
  });
}

function tournamentDelete(req, res){
  var id = req.params.id;

  Tournament.remove({ _id: id }, function(err) {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: "Deleted!" });
  });
}

module.exports = {
  index:  tournamentIndex,
  create: tournamentCreate,
  show:   tournamentShow,
  update: tournamentUpdate,
  delete: tournamentDelete
};
