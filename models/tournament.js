var mongoose = require("mongoose");
var Schema   = mongoose.Schema;
var Match = require("./match");

var tournamentSchema = mongoose.Schema({
  name: { type: String , required: true, unique: true},
  location: String,
  game: String,
  description: String,
  endDate: Date,
  creator: { type: mongoose.Schema.ObjectId, ref: 'User' },
  unconfirmedPlayers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  players: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  matches: [Match.schema],
  playerPoints: [Number],
  finalResults: [Number],

  finished: Boolean
});


module.exports = mongoose.model("Tournament", tournamentSchema);
