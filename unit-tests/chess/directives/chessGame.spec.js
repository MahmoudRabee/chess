'use strict';


    describe('chessGame', function() {
        var compile, scope, directiveElem;
        beforeEach(module('myApp.directives'));
        beforeEach(function () {
            inject(function ($compile, $rootScope) {
                compile = $compile;
                scope = $rootScope.$new();
            });

            directiveElem = getCompiledElement();
        });

        function getCompiledElement() {
            var element = angular.element('<canvas></canvas>');
            var compiledElement = compile(element)(scope);
            scope.$digest();
            return compiledElement;
        }
        });
