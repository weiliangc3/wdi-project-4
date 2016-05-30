var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var matchSchema = mongoose.Schema({
  score: [ Number ],
  played: Boolean,
  players: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
});


module.exports = mongoose.model("Match", matchSchema);
