angular
.module('FightFederation')
.factory("authInterceptor",AuthInterceptor);

AuthInterceptor.$inject = ["API", "TokenService"];
function AuthInterceptor(API, TokenService){
  return {

    request: function(config){
      var token = TokenService.getToken();

      if (config.url.indexOf(API) === 0 && token){
        config.headers.Authorization = "Bearer " + token;
      }

      return config;
    },

    response: function(response){
      if (response.config.url.indexOf(API) === 0 && response.data.token){
          TokenService.setToken(response.data.token);
      }
      return response;

    }
  };
}
