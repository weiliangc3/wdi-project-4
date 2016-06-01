var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var matchSchema = mongoose.Schema({
  score: [ Number ],
  played: Boolean,
  players: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  recordedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  winner: String
}, {
  timestamps: true
});


module.exports = mongoose.model("Match", matchSchema);
