var mongoose = require("mongoose");
var Schema   = mongoose.Schema;
var Match = require("./match");

var tournamentSchema = mongoose.Schema({
  name:               { type: String , required: true, unique: true },
  location:           String,
  game:               { type: String , required: true },
  description:        String,
  endDate:            Date,
  creator:            { type: mongoose.Schema.ObjectId, ref: 'User' },
  unconfirmedPlayers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  players:            [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  matches:            [Match.schema],
  playerWins:         [Number],
  playerLosses:       [Number],
  playerDraws:        [Number],
  playerPoints:       [Number],
  winner:             { type: mongoose.Schema.ObjectId, ref: 'User' },
  open:               Boolean,
  finished:           Boolean
}, {
  timestamps: true
});


module.exports = mongoose.model("Tournament", tournamentSchema);
