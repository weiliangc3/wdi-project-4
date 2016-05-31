angular
  .module('FightFederation')
  .factory('Match', Match);

Match.$inject = ['$resource', 'API'];
function Match($resource, API){

  return $resource(
    API+'/matches/:id', {id: '@id'},
    { 'get':       { method: 'GET' },
      'save':      { method: 'POST' },
      'query':     { method: 'GET', isArray: true},
      'remove':    { method: 'DELETE' },
      'delete':    { method: 'DELETE' },
      'update':    { method: 'PUT' }
    }
  );
}
