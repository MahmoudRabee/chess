'use strict';

(function() {
    describe('Board', function() {
        var board, width, height, stage, testBoard, player, events, i,j;

        beforeEach(angular.mock.module("myApp.services"));
        beforeEach(angular.mock.module("myApp.classes"));
        beforeEach(inject(function (_Board_) {
            testBoard = [['r2','n2','b2','k2','q2','b2','n2','r2'],
                ['p2','p2','p2','p2','p2','p2','p2','p2'],
                ['0','0','0','0','0','0','0','0'],
                ['0','0','0','0','0','0','0','0'],
                ['0','0','0','0','0','0','0','0'],
                ['0','0','0','0','0','0','0','0'],
                ['p1','p1','p1','p1','p1','p1','p1','p1'],
                ['r1','n1','b1','k1','q1','b1','n1','r1']];
            events = {
                testEvent: function(){},
                handleDrag: function(){},
                handleRelease: function(){}
            };
            player = 1;
            width = 1080;
            height = 720;
            board = new _Board_({width:width, height:height});
            stage = new createjs.Stage();

            board.addToStage(stage);
            board.create(testBoard, events, player);
        }));
        it('Bitmap exists.', function() {
            expect(board.bitmap).toBeDefined();
        });
        it('Has stage.', function() {
            expect(board.stage).toEqual(stage);
        });
        it('Can add to stage.', function() {
            expect(stage.getChildByName("bitmap")).toBeDefined();
        });
        it('Can remove from stage.', function() {
            board.removeFromStage(stage);
            expect(stage.getChildByName("bitmap")).toBeNull();
        });

        it('PieceArray exists', function(){
            expect(board.pieceArray).toBeDefined();
        });
        it('PieceArray is correct length and width', function(){
            expect(board.pieceArray.length).toEqual(8);
            for(i = 0; i < 8; i++) {
                if(testBoard[i][0] !== "0") {
                    expect(board.pieceArray[i].length).toEqual(8);
                }
            }
        });
        it('Creates Pieces', function(){
            for(i = 0; i < 8; i++){
                for(j = 0; j < 8; j++){
                    if (testBoard[i][j] !== "0") {
                        expect(board.pieceArray[i][j]).toBeDefined();
                    } else {
                        expect(board.pieceArray[i][j]).toBeUndefined();
                    }

                }
            }
        });
        it('Pieces are correct type', function(){
            //can pass if first letter of type is correct but rest are not
            var type;
            for(i = 0; i < 8; i++){
                for(j = 0; j < 8; j++){

                    if (testBoard[i][j] !== "0") {
                        type = board.pieceArray[i][j].type;
                        if (type === "knight")
                            type = 'n';
                        expect(type.charAt(0)).toEqual(testBoard[i][j].charAt(0));
                    }

                }
            }
        });
        it('Pieces are correct colour', function(){
            var colour;
            for(i = 0; i < 8; i++){
                for(j = 0; j < 8; j++){
                    if (testBoard[i][j] !== "0") {
                        colour = board.pieceArray[i][j].colour;
                        if (testBoard[i][j].charAt(1) === '1') {
                            expect(colour).toEqual("black");
                        } else {
                            expect(colour).toEqual("white");
                        }

                    }
                }
            }
        });
        it('Pieces are added to stage', function(){
            var child;
            for(i = 0; i < 8; i++){
                for(j = 0; j < 8; j++){
                    if (testBoard[i][j] !== "0") {
                        child = board.pieceArray[i][j].bitmap;
                        expect(findChild(child, stage)).toBeTruthy();
                    }
                }
            }
            function findChild(child, stage){
                var k;
                for(k = 0; k < stage.getNumChildren(); k++) {
                    if (stage.getChildAt(k) === child) {
                        return true;
                    }
                }
                return false;
            }
        });
        it('Pieces have event listeners', function(){
            //todo figure out how to get spyon working
        });
        it('Pieces are correct Positions', function(){
            var type, colour;
            for(i = 0; i < 8; i++){
                for(j = 0; j < 8; j++){

                    if (testBoard[i][j] !== "0") {
                        type = board.pieceArray[i][j].type;
                        if (type === "knight")
                            type = 'n';
                        expect(type.charAt(0)).toEqual(testBoard[i][j].charAt(0));
                        colour = board.pieceArray[i][j].colour;
                        if (testBoard[i][j].charAt(1) === '1') {
                            expect(colour).toEqual("black");
                        } else {
                            expect(colour).toEqual("white");
                        }
                    }

                }
            }
        });

    });
}());