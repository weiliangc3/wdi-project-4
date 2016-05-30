angular
  .module('FightFederation')
  .service("TokenService", TokenService);

TokenService.$inject = ["$window","jwtHelper"];
function TokenService($window, jwtHelper){
  var self = this;

  self.setToken = setToken;
  self.getToken = getToken;
  self.removeToken = removeToken;
  self.decodeToken = decodeToken;

  function setToken(token){
    return $window.localStorage.setItem("auth-token", token);
  }

  function getToken(){
    return $window.localStorage.getItem("auth-token");
  }

  function removeToken(){
    return $window.localStorage.removeItem("auth-token");
  }

  function decodeToken(){
    var token = self.getToken();
    if (token) {
      var decodedUser = jwtHelper.decodeToken(token);
      return decodedUser ? decodedUser._doc : null;
    }
  }
}
