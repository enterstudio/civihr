define(['services/services'], function (services) {    services.factory('ExampleService',['settings', '$log', function(settings, $log){        $log.debug('Service: ExampleService');        return {        }    }]);});