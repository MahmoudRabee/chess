'use strict';

(function() {
    describe('loaderSvc', function() {
        var loaderSvc;

        beforeEach(angular.mock.module('myApp.services'));
        beforeEach(inject(function (_loaderSvc_) {
            loaderSvc = _loaderSvc_;

        }));

        it('LoaderSvc should exist', function() {
            expect(loaderSvc).toBeDefined();
        });
        it('Manifest Loaded', function(){
            expect(loaderSvc.loadAssets).toBeDefined();
        });


    });
}());