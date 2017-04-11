'use strict';

(function() {
    describe('Socket', function() {
        var socket;
        beforeEach(angular.mock.module('myApp.classes'));
        beforeEach(inject(function (_Socket_) {
            socket = new _Socket_();

        }));
        //rest of test will be in e2e testing
        it('Socket should exist', function() {
            expect(socket).toBeDefined();
        });
        it('Socket listens', function() {
            spyOn(socket, "on");
            socket.on("test", function(){});
            expect(socket.on).toHaveBeenCalled();
        });
        it('Socket emits', function() {
            spyOn(socket, "emit");
            socket.emit("test", function(){});
            expect(socket.emit).toHaveBeenCalled();
        });

    });
}());