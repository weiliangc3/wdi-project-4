module.exports = {
  'port': process.env.PORT || 3000,
  'secret': process.env.JWT_SECRET || 'firstruleoffightfederationisdontlookatsecret',
  'database': process.env.MONGODB_URI || 'mongodb://localhost:27017/fightfederation'
};
