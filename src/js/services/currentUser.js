angular
  .module('FightFederation')
  .service('CurrentUser',CurrentUser);

CurrentUser.$inject = ["TokenService"];
function CurrentUser(TokenService){
    var self        = this;
    self.getUser    = getUser;
    self.clearUser  = clearUser;
    self.user       = getUser();

    function getUser(){
      return self.user ? self.user : TokenService.decodeToken();
    }

    function clearUser(){
      TokenService.removeToken();
      self.user = null;
    }
}
