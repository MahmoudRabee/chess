'use strict';

(function() {
    describe('GameEngine', function() {
        var GameEngine, container, isConnected, emitName, emitMsg;
        var board;
        /**
         * Capture all the socket events
         */
        var socketEvents = [];
        var mockSocket = {
            connect:function(){
                isConnected = true;
            },
            emit:function(name, msg){
                emitName = name;
                emitMsg = msg;
            },
            on:function(name, func){
                socketEvents[socketEvents.length] = [name, func];
            }
        };
        beforeEach(angular.mock.module('myApp.classes'));
        beforeEach(angular.mock.module('myApp.services'));
        beforeEach(inject(function (_GameEngine_) {
            board = [['r2', 'n2', 'b2', 'k2', 'q2', 'b2', 'n2', 'r2'],
                ['p2', 'p2', 'p2', 'p2', 'p2', 'p2', 'p2', 'p2'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1'],
                ['r1', 'n1', 'b1', 'k1', 'q1', 'b1', 'n1', 'r1']];
            GameEngine = _GameEngine_;
            container = new createjs.Container();
            socketEvents = [];
        }));
        it('Exists', function() {
            expect(GameEngine).toBeDefined();
        });
        it('Builds properly', function(){
            var num = container.getNumChildren();
            GameEngine.buildGame(container, mockSocket);
            var num2 = container.getNumChildren();
            expect(num2).toBeGreaterThan(num);
            expect(num2-num).toEqual(2);
            expect(socketEvents.length).toEqual(4);
            expect(socketEvents[0][0]).toEqual('connectionConfirmed');
            expect(socketEvents[1][0]).toEqual('initResponse');
            expect(socketEvents[2][0]).toEqual('startGame');
            expect(socketEvents[3][0]).toEqual('moveResponse');
            expect(isConnected).toBeTruthy();
        });
        it('connectionConfirmed socket event responds properly',function(){
            GameEngine.buildGame(container, mockSocket);
            socketEvents[0][1]();
            expect(emitName).toEqual("connectGame");
            expect(emitMsg).toEqual({opponent:null, name:'anon'});
        });
        describe('startGame socket event creates board and pieces', function(){
            var board = [['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0']];
            it('Empty board',function(){
                var msg = {
                    "player": 1,
                    "turn": 1,
                    "board": board
                };
                GameEngine.buildGame(container, mockSocket);
                expect(container.getNumChildren()).toEqual(2);
                socketEvents[2][1](msg);
                expect(container.getNumChildren()).toEqual(2);


            });
            it('Standard board',function(){
                board = [['r2', 'n2', 'b2', 'k2', 'q2', 'b2', 'n2', 'r2'],
                    ['p2', 'p2', 'p2', 'p2', 'p2', 'p2', 'p2', 'p2'],
                    ['0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0'],
                    ['p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1'],
                    ['r1', 'n1', 'b1', 'k1', 'q1', 'b1', 'n1', 'r1']];
                var msg = {
                    "player": 1,
                    "turn": 1,
                    "board": board
                };
                GameEngine.buildGame(container, mockSocket);
                expect(container.getNumChildren()).toEqual(2);
                socketEvents[2][1](msg);
                expect(container.getNumChildren()).toEqual(34);
            });
            it('Standard board player 2',function(){
                board = [['r2', 'n2', 'b2', 'k2', 'q2', 'b2', 'n2', 'r2'],
                    ['p2', 'p2', 'p2', 'p2', 'p2', 'p2', 'p2', 'p2'],
                    ['0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0'],
                    ['p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1'],
                    ['r1', 'n1', 'b1', 'k1', 'q1', 'b1', 'n1', 'r1']];
                var msg = {
                    "player": 2,
                    "turn": 1,
                    "board": board
                };
                GameEngine.buildGame(container, mockSocket);
                expect(container.getNumChildren()).toEqual(2);
                socketEvents[2][1](msg);
                expect(container.getNumChildren()).toEqual(34);
            });
            it('Standard -1 board',function(){
                board = [['r2', 'n2', 'b2', 'k2', 'q2', 'b2', 'n2', 'r2'],
                    ['p2', 'p2', 'p2', 'p2', 'p2', 'p2', 'p2', 'p2'],
                    ['0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0'],
                    ['p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1', '0'],
                    ['r1', 'n1', 'b1', 'k1', 'q1', 'b1', 'n1', 'r1']];
                var msg = {
                    "player": 1,
                    "turn": 1,
                    "board": board
                };
                GameEngine.buildGame(container, mockSocket);
                expect(container.getNumChildren()).toEqual(2);
                socketEvents[2][1](msg);
                expect(container.getNumChildren()).toEqual(33);
            });
            it('No king board',function(){
                board = [['r2', 'n2', 'b2', '0', 'q2', 'b2', 'n2', 'r2'],
                    ['p2', 'p2', 'p2', 'p2', 'p2', 'p2', 'p2', 'p2'],
                    ['0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0'],
                    ['p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1'],
                    ['r1', 'n1', 'b1', '0', 'q1', 'b1', 'n1', 'r1']];
                var msg = {
                    "player": 1,
                    "turn": 1,
                    "board": board
                };
                GameEngine.buildGame(container, mockSocket);
                expect(container.getNumChildren()).toEqual(2);
                socketEvents[2][1](msg);
                expect(container.getNumChildren()).toEqual(32);
            });
            it('Full of pawns board',function(){
                board = [['p2', 'p2', 'p2', 'p2', 'p2', 'p2', 'p2', 'p2'],
                    ['p2', 'p2', 'p2', 'p2', 'p2', 'p2', 'p2', 'p2'],
                    ['p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1'],
                    ['p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1'],
                    ['p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1'],
                    ['p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1'],
                    ['p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1'],
                    ['p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1']];
                var msg = {
                    "player": 1,
                    "turn": 1,
                    "board": board
                };
                GameEngine.buildGame(container, mockSocket);
                expect(container.getNumChildren()).toEqual(2);
                socketEvents[2][1](msg);
                expect(container.getNumChildren()).toEqual(66);
            });
        });

        it('startGame socket event creates UI event listeners',function(){
            var msg = {
                "player": 1,
                "turn": 1,
                "board": board
            };
            GameEngine.buildGame(container, mockSocket);
            socketEvents[2][1](msg);
            var i;
            for(i=2; i < container.numChildren; i++) {
                expect(container.getChildAt(i).hasEventListener).toBeTruthy();
            }

        });
        it('Has Correct player (1)',function(){
            GameEngine.buildGame(container, mockSocket);
            var msg = {
                "player":1,
                "gameId":0
            };
            socketEvents[1][1](msg);
            msg = {
                "turn": 1,
                "board": board
            };
            socketEvents[2][1](msg);
            var boardobj = container.getChildAt(0).board.pieceArray;
            expect(boardobj[0][0].colour).toEqual("white")
        });
        it('Has Correct player (2)',function(){
            GameEngine.buildGame(container, mockSocket);
            var msg = {
                "player":2,
                "gameId":0
            };
            socketEvents[1][1](msg);
            msg = {
                "turn": 1,
                "board": board
            };
            socketEvents[2][1](msg);
            var boardobj = container.getChildAt(0).board.pieceArray;
            expect(boardobj[0][0].colour).toEqual("white");
        });
        describe('Banner', function(){
            it('Changes text when its players turn', function(){
                GameEngine.buildGame(container, mockSocket);
                var banner = container.getChildAt(1);
                expect(banner.getChildAt(2).text).toEqual("Waiting For Other Player");
            });
            it('Changes text when its players turn (1)', function(){
                GameEngine.buildGame(container, mockSocket);
                var msg = {
                    "player":1,
                    "gameId":0
                };
                socketEvents[1][1](msg);
                msg = {
                    "turn": 1,
                    "board": board
                };
                socketEvents[2][1](msg);


                var banner = container.getChildByName("banner");
                expect(banner.getChildAt(2).text).toEqual("Your Turn");
            });
            it('Changes text when its players turn (2)', function(){
                GameEngine.buildGame(container, mockSocket);
                var msg = {
                    "player":2,
                    "gameId":0
                };
                socketEvents[1][1](msg);
                msg = {
                    "turn": 2,
                    "board": board
                };
                socketEvents[2][1](msg);
                var banner = container.getChildByName("banner");
                expect(banner.getChildAt(2).text).toEqual("Your Turn");
            });
            it('Changes text when its players turn (even)', function(){
                GameEngine.buildGame(container, mockSocket);
                var msg = {
                    "player":2,
                    "gameId":0
                };
                socketEvents[1][1](msg);
                msg = {
                    "turn": 16,
                    "board": board
                };
                socketEvents[2][1](msg);
                var banner = container.getChildByName("banner");
                expect(banner.getChildAt(2).text).toEqual("Your Turn");
            });
            it('Changes text when its players turn (odd)', function(){
                GameEngine.buildGame(container, mockSocket);
                var msg = {
                    "player":1,
                    "gameId":0
                };
                socketEvents[1][1](msg);
                msg = {
                    "turn": 37,
                    "board": board
                };
                socketEvents[2][1](msg);
                var banner = container.getChildByName("banner");
                expect(banner.getChildAt(2).text).toEqual("Your Turn");
            });
            it('Changes text when its players turn (false)', function(){
                GameEngine.buildGame(container, mockSocket);
                var msg = {
                    "player":2,
                    "gameId":0
                };
                socketEvents[1][1](msg);
                msg = {
                    "turn": 1,
                    "board": board
                };
                socketEvents[2][1](msg);
                var banner = container.getChildByName("banner");
                expect(banner.getChildAt(2).text === "Your Turn").toBeFalsy();
            });

        });
        describe('moveResponse Event', function(){
            it('Moves Piece', function(){
                var piece;
                GameEngine.buildGame(container, mockSocket);
                var msg = {
                    "player":1,
                    "gameId":0
                };
                socketEvents[1][1](msg);
                msg = {
                    "turn": 1,
                    "board": board
                };
                socketEvents[2][1](msg);
                var boardobj = container.getChildAt(0).board.pieceArray;
                piece = boardobj[1][1];
                expect(boardobj[1][1]).toEqual(piece);
                msg = {
                    "turn": 1,
                    "response": true,
                    "oldX": 1, "oldY": 1,
                    "newX": 1, "newY": 2,
                    "check": [false,false]
                };
                socketEvents[3][1](msg);
                expect(boardobj[1][1]).toEqual(null);
                expect(boardobj[2][1]).toBeDefined();
                expect(boardobj[3][1]).toBeUndefined();

            });
            it('Increases the turn count and move piece back on invalid', function(){
                var piece;
                GameEngine.buildGame(container, mockSocket);
                var msg = {
                    "player":1,
                    "gameId":0
                };
                socketEvents[1][1](msg);
                msg = {
                    "turn": 1,
                    "board": board
                };
                socketEvents[2][1](msg);
                var boardobj = container.getChildAt(0).board.pieceArray;
                piece = boardobj[1][1];
                expect(boardobj[1][1]).toEqual(piece);
                msg = {
                    "turn": 1,
                    "response": true,
                    "oldX": 1, "oldY": 1,
                    "newX": 1, "newY": 2,
                    "check": [false,false]
                };
                socketEvents[3][1](msg);
                expect(boardobj[1][1]).toEqual(null);
                expect(boardobj[2][1]).toBeDefined();
                expect(boardobj[3][1]).toBeUndefined();
                msg = {
                    "turn": 2,
                    "response": false,
                    "oldX": 1, "oldY": 2,
                    "newX": 1, "newY": 3,
                    "check": [false,false]
                };
                socketEvents[3][1](msg);
                expect(boardobj[2][1] !== null).toBeTruthy();
                expect(boardobj[3][1]).toBeUndefined();
            });
        });

    });
}());