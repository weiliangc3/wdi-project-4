var mongoose = require("mongoose");
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  local: {
    username: { type: String, required: true, unique: true },
    fullname: { type: String },
    email:    { type: String, unique: true, required: true },
    password: { type: String, required: true }
  },
  tournaments: [{ type: mongoose.Schema.ObjectId, ref: 'Tournament' }]
}, {
  timestamps: true
});

// INCLUDE PASSWORD CONFIRMATION

userSchema.statics.encrypt = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model("User", userSchema);
