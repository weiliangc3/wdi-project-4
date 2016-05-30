module.exports = {
  'port': process.env.PORT || 3000,
  'secret': process.env.JWT_SECRET || 'firstruleoffightfederationisdontlookatsecret',
  'database': process.env.MONGODB_URL || 'mongodb://localhost:27017/fightfederation'
};
