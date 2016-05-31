angular
  .module('FightFederation')
  .factory('Tournament', Tournament);

Tournament.$inject = ['$resource', 'API'];
function Tournament($resource, API){

  return $resource(
    API+'/tournaments/:id', {id: '@id'},
    { 'get':       { method: 'GET' },
      'save':      { method: 'POST' },
      'query':     { method: 'GET', isArray: true},
      'remove':    { method: 'DELETE' },
      'delete':    { method: 'DELETE' },
      'update':    { method: 'PUT' }
    }
  );
}
