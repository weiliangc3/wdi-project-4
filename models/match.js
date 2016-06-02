var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var matchSchema = mongoose.Schema({
  score:      [ Number ],
  played:     { type: Boolean, default: false },
  players:    [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  recordedBy: String,
  winner:     String,
  active:     { type: Boolean, default: true }
}, {
  timestamps: true
});


module.exports = mongoose.model("Match", matchSchema);
