angular
  .module('FightFederation')
  .factory('Tournament', Tournament);

Tournament.$inject = ['$resource', 'API'];
function Tournament($resource, API){

  return $resource(
    API+'/users/:id', {id: '@id'},
    { 'get':       { method: 'GET' },
      'save':      { method: 'POST' },
      'query':     { method: 'GET', isArray: false},
      'remove':    { method: 'DELETE' },
      'delete':    { method: 'DELETE' },
      'register':  {
        url: API + "/register",
        method: "POST"
      },
      'login':     {
        url: API + "/login",
        method: "POST"
      }
    }
  );
}
