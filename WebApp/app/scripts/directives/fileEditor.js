'use strict';

/**
 * @ngdoc directive
 * @name webAppApp.directive:FileEditor
 * @description
 * # FileEditor
 */
angular.module('webAppApp')
    .directive('fileEditor', function() {
        return {
            template: '<input type="file" class="form-control" ng-model="ngModel" />',
            scope: {
                ngModel: '='
            },
            restrict: 'E',
            link: function postLink(scope, element, attrs) {

            }
        };
    });