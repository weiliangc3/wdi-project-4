angular
.module('FightFederation')
.controller('UsersController', UsersController);

UsersController.$inject = ['User','CurrentUser', '$state', '$stateParams'];
function UsersController(User, CurrentUser, $state, $stateParams){

  var self = this;

  self.all           = [];
  self.user          = null;
  self.currentUser   = null;
  self.error         = null;
  self.getUsers      = getUsers;
  self.register      = register;
  self.login         = login;
  self.logout        = logout;
  self.checkLoggedIn = checkLoggedIn;

  if ($stateParams.userId){
    self.user = User.get({ id: $stateParams.userId }, function(res){
      self.user = res.user;
    });
  }

  function getUsers() {
    User.query(function(data){
      self.all = data.users;
    });
  }

  function handleLogin(res) {
    var token = res.token ? res.token : null ;
    if (token){
      self.currentUser = CurrentUser.getUser();
      self.getUsers();
      $state.go("tournaments");
    }
  }

  function handleError(e) {
    self.error = "Something went wrong.";
  }

  function register() {
    User.register(self.user, handleLogin, handleError);
  }

  function login() {
    User.login(self.user, handleLogin, handleError);
  }

  function logout() {
    self.all         = null;
    self.currentUser = null;
    self.user        = null;
    CurrentUser.clearUser();
  }

  function checkLoggedIn() {
    self.currentUser = CurrentUser.getUser();
    return !!self.currentUser;
  }

  if (checkLoggedIn()) {
    self.getUsers();
  }

  return self;

}
