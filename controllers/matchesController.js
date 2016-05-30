var Match = require("../models/match");

function matchesIndex(req, res){
  Match.find({}, function(err, match) {
    if (err) return res.status(404).json(err);
    res.status(200).json({ matches: matches });
  });
}

function matchesCreate(req, res){
  var match = new Match(req.body.match);
  match.save(function(err, match){
    if (err) return res.status(500).json(err);
    res.status(201).json({ match: match });
  });
}

function matchesShow(req, res){
  var id = req.params.id;

  Match.findById({ _id: id }, function(err, match) {
    if (err) return res.status(500).json(err);
    if (!match) return res.status(404).json(err);
    res.status(200).json({ match: match });
  });
}

function matchesUpdate(req, res){
  var id = req.params.id;

  Match.findByIdAndUpdate({ _id: id }, req.body, function(err, match){
    if (err) return res.status(500).json(err);
    if (!match) return res.status(404).json(err);
    res.status(200).json({ match: match });
  });
}

function matchesDelete(req, res){
  var id = req.params.id;

  Match.remove({ _id: id }, function(err) {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: "Deleted!" });
  });
}

module.exports = {
  matchesIndex:  matchesIndex,
  matchesCreate: matchesCreate,
  matchesShow:   matchesShow,
  matchesUpdate: matchesUpdate,
  matchesDelete: matchesDelete
};
