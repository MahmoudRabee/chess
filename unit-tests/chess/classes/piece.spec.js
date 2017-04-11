'use strict';

(function() {
    describe('Piece', function() {
        var piece;
        beforeEach(angular.mock.module("myApp.services"));
        beforeEach(angular.mock.module("myApp.classes"));
        beforeEach(inject(function (_Piece_) {
            piece = new _Piece_("pawn", "black");
        }));
        it('Piece exists', function() {
            expect(piece.bitmap).toBeDefined();
        });
        it('Piece has color', function() {
            expect(piece.colour).toEqual("black");
        });
        it('Piece has type', function() {
            expect(piece.type).toEqual("pawn");
        });
        it('Can add to stage', function() {
            var stage = new createjs.Stage();
            piece.addToStage(stage);
            expect(stage.getChildAt(0)).toBeDefined();
        });
        it('Can remove from stage', function() {
            var stage = new createjs.Stage();
            piece.addToStage(stage);
            piece.removeFromStage(stage);
            expect(stage.getChildAt(0)).toBeFalsy();
        });
        describe('setPos(x, y)', function() {
            function testPos(x, y){
                var bitx = (x * (90)) + 15;
                var bity = (y * (90));
                it('Position: (' + x + ', ' + y + ")", function() {
                    piece.setPos(x, y);
                    expect(piece.posX).toEqual(x);
                    expect(piece.posY).toEqual(y);
                    expect(piece.bitmap.x).toEqual(bitx);
                    expect(piece.bitmap.y).toEqual(bity);
                });
            }
            testPos(5, 6);
            testPos(0, 0);
            testPos(0, 1);
            testPos(7, 6);
            testPos(7, 7);
        });
    });

}());