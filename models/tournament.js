var mongoose = require("mongoose");

var tournamentSchema = mongoose.Schema({
  name: { type: String , required: true, unique: true},
  location: String,
  game: String,
  description: String,
  endDate: Date,
  unconfirmedPlayers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  players: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  matches: [Match.schema],
  playerPoints: [Number],
  finalResults: [Number],

  finished: Boolean
});


module.exports = mongoose.model("Tournament", tournamentSchema);
