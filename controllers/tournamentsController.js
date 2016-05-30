var Tournament = require("../models/tournament");

function tournamentsIndex(req, res){
  Tournament.find({}, function(err, tournament) {
    if (err) return res.status(404).json(err);
    res.status(200).json({ tournaments: tournaments });
  });
}

function tournamentsCreate(req, res){
  var tournament = new Tournament(req.body.tournament);
  tournament.save(function(err, tournament){
    if (err) return res.status(500).json(err);
    res.status(201).json({ tournament: tournament });
  });
}

function tournamentsShow(req, res){
  var id = req.params.id;

  Tournament.findById({ _id: id }, function(err, tournament) {
    if (err) return res.status(500).json(err);
    if (!tournament) return res.status(404).json(err);
    res.status(200).json({ tournament: tournament });
  });
}

function tournamentsUpdate(req, res){
  var id = req.params.id;

  Tournament.findByIdAndUpdate({ _id: id }, req.body, function(err, tournament){
    if (err) return res.status(500).json(err);
    if (!tournament) return res.status(404).json(err);
    res.status(200).json({ tournament: tournament });
  });
}

function tournamentsDelete(req, res){
  var id = req.params.id;

  Tournament.remove({ _id: id }, function(err) {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: "Deleted!" });
  });
}

module.exports = {
  tournamentsIndex:  tournamentsIndex,
  tournamentsCreate: tournamentsCreate,
  tournamentsShow:   tournamentsShow,
  tournamentsUpdate: tournamentsUpdate,
  tournamentsDelete: tournamentsDelete
};