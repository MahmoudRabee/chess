'use strict';

var GameServer = require("./../../../chess/server/ChessInstance.js");
(function() {
    var id = 0, socFunc, socFunc2, onName, onName2, emitName, emitName2,
        chess, mockClient, mockClient2, response, response2, board;
    describe('Message passing', function() {
        beforeEach(function(){
            chess = new GameServer.ChessInstance(id);
            mockClient = {
                emit:function(name, msg){
                    emitName = name;
                    response = msg;
                },
                on:function(name, func){
                    onName = name;
                    socFunc = func;
                }
            };
            mockClient2 = {
                emit:function(name, msg){
                    emitName2 = name;
                    response2 = msg;
                },
                on:function(name, func){
                    onName2 = name;
                    socFunc2 = func;
                }
            };
        });
        it('Exists', function(){
            expect(chess).toBeDefined();
        });
        it('Has proper numPlayers', function(){
            expect(chess.getNumPlayers()).toEqual(0);
        });
        it('Can add players', function(){
            expect(chess.getNumPlayers()).toEqual(0);
            chess.addPlayer(mockClient, "mock");
            expect(emitName2).toBeUndefined();
            expect(chess.getNumPlayers()).toEqual(1);
            expect(emitName).toEqual("initResponse");
            chess.addPlayer(mockClient2, "mock");
            expect(chess.getNumPlayers()).toEqual(2);
            expect(emitName).toEqual('startGame');
            expect(emitName2).toEqual('startGame');
        });
        it('Creates move socket event', function(){
            chess.addPlayer(mockClient, "mock");
            expect(onName).toEqual("move");
            chess.addPlayer(mockClient2, "mock2");
            expect(onName2).toEqual("move");
        });
        it('Move socket event responds properly', function(){
            var msg = {
                player:1,
                oldX:0,
                oldY:0,
                newX:1,
                newY:1
            };
            chess.addPlayer(mockClient, "mock");
            chess.addPlayer(mockClient2, "mock2");
            socFunc(msg);
            expect(emitName).toEqual('moveResponse');
            expect(emitName2).toEqual('moveResponse');
            expect(response.response).toBeFalsy();
            expect(response2.response).toBeFalsy();
        });
        it('Sends start signal', function(){
            chess.addPlayer(mockClient, "mock");
            chess.addPlayer(mockClient2, "mock2");
            expect(emitName).toEqual('startGame');
            expect(emitName2).toEqual('startGame');
        });
        it('Sends proper board updates', function(){
            chess.addPlayer(mockClient, "mock");
            chess.addPlayer(mockClient2, "mock2");
            expect(compareBoards(response.board,response2.board)).toBeTruthy();
        });
        it('Flips positional data for opponent properly', function(){
            var moveFunc;
            var msg = {
                player:1,
                oldX:0,
                oldY:0,
                newX:1,
                newY:1
            };
            chess.addPlayer(mockClient, "mock");
            chess.addPlayer(mockClient2, "mock2");
            moveFunc = socFunc;
            moveFunc(msg);
            expect(msg.oldX).toEqual((7-response2.oldX));
            expect(msg.oldY).toEqual((7-response2.oldY));
            expect(msg.newX).toEqual((7-response2.newX));
            expect(msg.newY).toEqual((7-response2.newY));
            expect(response2.response).toBeFalsy();

        });

    });
    describe('Only allows legal moves', function(){
        var move;
        beforeEach(function(){
            chess = new GameServer.ChessInstance(id);
            mockClient = {
                emit:function(name, msg){
                    emitName = name;
                    response = msg;
                },
                on:function(name, func){
                    onName = name;
                    socFunc = func;
                }
            };
            mockClient2 = {
                emit:function(name, msg){
                    emitName2 = name;
                    response2 = msg;
                },
                on:function(name, func){
                    onName2 = name;
                    socFunc2 = func;
                }
            };
            chess.addPlayer(mockClient, "mock");
            chess.addPlayer(mockClient2, "mock2");
        });
        it("Can't move Empty", function(){
            chess.setBoard([['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0']]);
            socFunc({ player: 1, type: 'king', colour: 'black', oldX: 1, oldY: 0, newX: 2, newY: 0 });
            expect(response.response).toBeFalsy();
        });
        it('Pawns move legally', function(){
            //the client will always think it is the bottom player
            socFunc({ player: 1, type: 'pawn', colour: 'black', oldX: 7, oldY: 6, newX: 7, newY: 4 });
            expect(response.response).toBeTruthy();
            socFunc2({ player: 2, type: 'pawn', colour: 'white', oldX: 0, oldY: 6, newX: 0, newY: 5 });
            expect(response2.response).toBeTruthy();
            socFunc({ player: 1, type: 'pawn', colour: 'black', oldX: 3, oldY: 6, newX: 3, newY: 4 });
            expect(response.response).toBeTruthy();
            socFunc2({ player: 2, type: 'pawn', colour: 'white', oldX: 3, oldY: 6, newX: 3, newY: 4 });
            expect(response2.response).toBeTruthy();
            socFunc2({ player: 1, type: 'pawn', colour: 'black', oldX: 3, oldY: 4, newX: 3, newY: 3 });
            expect(response.response).toBeTruthy();
            socFunc2({ player: 2, type: 'pawn', colour: 'white', oldX: 2, oldY: 6, newX: 3, newY: 4 });
            expect(response2.response).toBeFalsy();
            socFunc2({ player: 2, type: 'pawn', colour: 'white', oldX: 2, oldY: 6, newX: 3, newY: 3 });
            expect(response2.response).toBeFalsy();
            socFunc2({ player: 2, type: 'pawn', colour: 'black', oldX: 5, oldY: 6, newX: 5, newY: 4 });
            expect(response.response).toBeFalsy();
            socFunc2({ player: 1, type: 'pawn', colour: 'white', oldX: 5, oldY: 6, newX: 5, newY: 4 });
            expect(response.response).toBeFalsy();
            socFunc2({ player: 2, type: 'pawn', colour: 'white', oldX: 0, oldY: 5, newX: 0, newY: 6 });
            expect(response2.response).toBeFalsy();
            socFunc2({ player: 2, type: 'pawn', colour: 'white', oldX: 7, oldY: 6, newX: 7, newY: 7 });
            expect(response2.response).toBeFalsy();

            chess.setBoard([['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', 'p2', '0', 'p2', '0', '0', '0'],
                ['0', '0', 'p1', '0', '0', 'p1', '0', '0'],
                ['0', '0', 'p2', '0', 'p1', '0', '0', '0'],
                ['0', '0', '0', 'p1', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0']]);
            socFunc({ player: 1, type: 'pawn', colour: 'black', oldX: 3, oldY: 5, newX: 2, newY: 4 });
            expect(response.response).toBeTruthy();
            socFunc2({ player: 2, type: 'pawn', colour: 'white', oldX: 3, oldY: 5, newX: 2, newY: 4 });
            expect(response.response).toBeTruthy();
            socFunc({ player: 1, type: 'pawn', colour: 'black', oldX: 4, oldY: 4, newX: 5, newY: 3 });
            expect(response.response).toBeTruthy();
        });
        it('Rooks move legally', function() {
            chess.setBoard([['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', 'r2', '0', '0'],
                ['0', '0', 'r2', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', 'r1', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0']]);
            socFunc({ player: 1, type: 'rook', colour: 'black', oldX: 5, oldY: 5, newX: 0, newY: 5 });
            expect(response.response).toBeTruthy();
            socFunc2({ player: 2, type: 'rook', colour: 'white', oldX: 5, oldY: 5, newX: 5, newY: 7 });
            expect(response2.response).toBeTruthy();
            socFunc({ player: 1, type: 'rook', colour: 'black', oldX: 0, oldY: 5, newX: 6, newY: 7 });
            expect(response.response).toBeFalsy();
            socFunc({ player: 1, type: 'rook', colour: 'black', oldX: 0, oldY: 5, newX: 2, newY: 5 });
            expect(response.response).toBeTruthy();
            socFunc2({ player: 2, type: 'rook', colour: 'white', oldX: 5, oldY: 7, newX: 1, newY: 1 });
            expect(response2.response).toBeFalsy();
            socFunc2({ player: 2, type: 'rook', colour: 'white', oldX: 5, oldY: 7, newX: 0, newY: 7 });
            expect(response2.response).toBeTruthy();
        });
        it('Knights move legally', function(){
            chess.setBoard([['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', 'k2', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', 'k1', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0']]);
            socFunc({ player: 1, type: 'knight', colour: 'black', oldX: 3, oldY: 6, newX: 0, newY: 5 });
            expect(response.response).toBeFalsy();
            socFunc({ player: 1, type: 'knight', colour: 'black', oldX: 3, oldY: 6, newX: 2, newY: 5 });
            expect(response.response).toBeFalsy();
            socFunc({ player: 1, type: 'knight', colour: 'black', oldX: 3, oldY: 6, newX: 5, newY: 5 });
            expect(response.response).toBeTruthy();
            socFunc2({ player: 2, type: 'knight', colour: 'white', oldX: 4, oldY: 5, newX: 4, newY: 5 });
            expect(response2.response).toBeFalsy();
            socFunc2({ player: 2, type: 'knight', colour: 'white', oldX: 4, oldY: 5, newX: 7, newY: 5 });
            expect(response2.response).toBeFalsy();
            socFunc2({ player: 2, type: 'knight', colour: 'white', oldX: 4, oldY: 5, newX: 2, newY: 4 });
            expect(response2.response).toBeTruthy();
        });
        it('Bishops move legally', function(){
            chess.setBoard([['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', 'b2', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', 'b1'],
                ['0', '0', '0', '0', '0', '0', '0', '0']]);
            socFunc({ player: 1, type: 'bishop', colour: 'black', oldX: 7, oldY: 6, newX: 0, newY: 5 });
            expect(response.response).toBeFalsy();
            socFunc({ player: 1, type: 'bishop', colour: 'black', oldX: 7, oldY: 6, newX: 7, newY: 3 });
            expect(response.response).toBeFalsy();
            socFunc({ player: 1, type: 'bishop', colour: 'black', oldX: 7, oldY: 6, newX: 4, newY: 3 });
            expect(response.response).toBeTruthy();
            socFunc2({ player: 2, type: 'bishop', colour: 'white', oldX: 4, oldY: 5, newX: 0, newY: 5 });
            expect(response2.response).toBeFalsy();
            socFunc2({ player: 2, type: 'bishop', colour: 'white', oldX: 4, oldY: 5, newX: 7, newY: 4 });
            expect(response2.response).toBeFalsy();
            socFunc2({ player: 2, type: 'bishop', colour: 'white', oldX: 4, oldY: 5, newX: 7, newY: 2 });
            expect(response2.response).toBeTruthy();
        });
        it('Queens move legally', function(){
            chess.setBoard([['0', 'q1', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', 'q2', '0', '0']]);
            socFunc({ player: 1, type: 'queen', colour: 'black', oldX: 1, oldY: 0, newX: 0, newY: 5 });
            expect(response.response).toBeFalsy();
            socFunc({ player: 1, type: 'queen', colour: 'black', oldX: 1, oldY: 0, newX: 7, newY: 3 });
            expect(response.response).toBeFalsy();
            socFunc({ player: 1, type: 'queen', colour: 'black', oldX: 1, oldY: 0, newX: 1, newY: 3 });
            expect(response.response).toBeTruthy();
            socFunc2({ player: 2, type: 'queen', colour: 'white', oldX: 2, oldY: 0, newX: 6, newY: 5 });
            expect(response2.response).toBeFalsy();
            socFunc2({ player: 2, type: 'queen', colour: 'white', oldX: 2, oldY: 0, newX: 3, newY: 4 });
            expect(response2.response).toBeFalsy();
            socFunc2({ player: 2, type: 'queen', colour: 'white', oldX: 2, oldY: 0, newX: 2, newY: 7 });
            expect(response2.response).toBeTruthy();

            socFunc({ player: 1, type: 'queen', colour: 'black', oldX: 1, oldY: 3, newX: 0, newY: 5 });
            expect(response.response).toBeFalsy();
            socFunc({ player: 1, type: 'queen', colour: 'black', oldX: 1, oldY: 3, newX: 7, newY: 4 });
            expect(response.response).toBeFalsy();
            socFunc({ player: 1, type: 'queen', colour: 'black', oldX: 1, oldY: 3, newX: 5, newY: 7 });
            expect(response.response).toBeTruthy();
            socFunc2({ player: 2, type: 'queen', colour: 'white', oldX: 2, oldY: 7, newX: 6, newY: 5 });
            expect(response2.response).toBeFalsy();
            socFunc2({ player: 2, type: 'queen', colour: 'white', oldX: 2, oldY: 7, newX: 3, newY: 4 });
            expect(response2.response).toBeFalsy();
            socFunc2({ player: 2, type: 'queen', colour: 'white', oldX: 2, oldY: 7, newX: 0, newY: 5 });
            expect(response2.response).toBeTruthy();
        });
        it('Kings move legal(without check)', function(){
            chess.setBoard([['0', 'k1', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', ''],
                ['0', '0', '0', '0', '0', 'k2', '0', '0']]);
            socFunc({ player: 1, type: 'king', colour: 'black', oldX: 1, oldY: 0, newX: 0, newY: 5 });
            expect(response.response).toBeFalsy();
            socFunc({ player: 1, type: 'king', colour: 'black', oldX: 1, oldY: 0, newX: 7, newY: 3 });
            expect(response.response).toBeFalsy();
            socFunc({ player: 1, type: 'king', colour: 'black', oldX: 1, oldY: 0, newX: 1, newY: 1 });
            expect(response.response).toBeTruthy();

            socFunc2({ player: 2, type: 'king', colour: 'white', oldX: 2, oldY: 0, newX: 2, newY: 2 });
            expect(response2.response).toBeFalsy();
            socFunc2({ player: 2, type: 'king', colour: 'white', oldX: 2, oldY: 0, newX: 3, newY: 4 });
            expect(response2.response).toBeFalsy();
            socFunc2({ player: 2, type: 'king', colour: 'white', oldX: 2, oldY: 0, newX: 2, newY: 1 });
            expect(response2.response).toBeTruthy();

            socFunc({ player: 1, type: 'king', colour: 'black', oldX: 1, oldY: 1, newX: 2, newY: 2 });
            expect(response.response).toBeTruthy();
            socFunc2({ player: 2, type: 'king', colour: 'white', oldX: 2, oldY: 1, newX: 2, newY: 0 });
            expect(response2.response).toBeTruthy();
        });

    });
    describe('Check', function(){
        beforeEach(function(){
            chess = new GameServer.ChessInstance(id);
            mockClient = {
                emit:function(name, msg){
                    emitName = name;
                    response = msg;
                },
                on:function(name, func){
                    onName = name;
                    socFunc = func;
                }
            };
            mockClient2 = {
                emit:function(name, msg){
                    emitName2 = name;
                    response2 = msg;
                },
                on:function(name, func){
                    onName2 = name;
                    socFunc2 = func;
                }
            };
            chess.addPlayer(mockClient, "mock");
            chess.addPlayer(mockClient2, "mock2");
        });
        it('Pawn', function() {
            chess.setBoard([['0', 'k2', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', 'p1', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', 'p2', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', 'k1', '0', '0']]);
            socFunc({ player: 1, type: 'pawn', colour: 'black', oldX: 2, oldY: 2, newX: 2, newY: 1 });
            expect(response.response).toBeTruthy();
            expect(response.check[1]).toBeTruthy();

            socFunc2({ player: 2, type: 'king', colour: 'white', oldX: 6, oldY: 7, newX: 6, newY: 6 });
            expect(response2.response).toBeTruthy();
            expect(response.check[1]).toBeFalsy();

            socFunc({ player: 1, type: 'king', colour: 'black', oldX: 5, oldY: 7, newX: 5, newY: 6 });
            expect(response.response).toBeFalsy();
            expect(response.check[0]).toBeFalsy();

            socFunc({ player: 1, type: 'pawn', colour: 'black', oldX: 2, oldY: 1, newX: 2, newY: 0 });
            expect(response.response).toBeTruthy();
            expect(response.check[0]).toBeFalsy();

            socFunc2({ player: 2, type: 'king', colour: 'white', oldX: 6, oldY: 6, newX: 5, newY: 7 });
            expect(response2.response).toBeTruthy();
            expect(response.check[1]).toBeFalsy();
        });
        it('Rook', function() {
            chess.setBoard([['0', '0', '0', '0', '0', 'k2', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', 'r1', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', 'r2', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', 'k1', '0', '0', '0', '0']]);
            socFunc({ player: 1, type: 'rook', colour: 'black', oldX: 2, oldY: 2, newX: 2, newY: 0 });
            expect(response.response).toBeTruthy();
            expect(response.check[1]).toBeTruthy();
            socFunc2({ player: 2, type: 'king', colour: 'white', oldX: 2, oldY: 7, newX: 2, newY: 6 });
            expect(response2.response).toBeTruthy();
            expect(response.check[1]).toBeFalsy();
            socFunc({ player: 1, type: 'king', colour: 'black', oldX: 3, oldY: 7, newX: 2, newY: 7 });
            expect(response.response).toBeTruthy();
            expect(response.check[0]).toBeFalsy();
            socFunc2({ player: 2, type: 'rook', colour: 'white', oldX: 6, oldY: 2, newX: 6, newY: 0 });
            expect(response2.response).toBeTruthy();
            expect(response.check[0]).toBeTruthy();
            socFunc({ player: 1, type: 'king', colour: 'black', oldX: 2, oldY: 7, newX: 2, newY: 6 });
            expect(response.response).toBeTruthy();
            expect(response.check[0]).toBeFalsy();
            socFunc2({ player: 2, type: 'king', colour: 'white', oldX: 2, oldY: 6, newX: 2, newY: 5 });
            socFunc({ player: 1, type: 'king', colour: 'black', oldX: 2, oldY: 6, newX: 1, newY: 7 });
            expect(response.response).toBeTruthy();
            expect(response.check[0]).toBeFalsy();
        });
        it('Knight', function(){
            chess.setBoard([['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', 'k1', '0', 'n2', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', 'k2', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', 'n1', '0', '0', '0', '0']]);
            socFunc({ player: 1, type: 'knight', colour: 'black', oldX: 3, oldY: 7, newX: 1, newY: 6 });
            expect(response.response).toBeTruthy();
            expect(response.check[1]).toBeTruthy();
            socFunc2({ player: 2, type: 'knight', colour: 'white', oldX: 4, oldY: 5, newX: 3, newY: 7 });
            expect(response2.response).toBeFalsy();
            socFunc2({ player: 2, type: 'king', colour: 'white', oldX: 5, oldY: 3, newX: 6, newY: 2 });
            expect(response2.response).toBeTruthy();
            expect(response.check[1]).toBeFalsy();
        });
        it('Bishop', function(){
            chess.setBoard([['k2', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['b2', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', 'k1', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', 'b1', '0', '0']]);
            socFunc({ player: 1, type: 'bishop', colour: 'black', oldX: 5, oldY: 7, newX: 6, newY: 6 });
            expect(response.response).toBeTruthy();
            expect(response.check[1]).toBeTruthy();
            //block
            socFunc2({ player: 2, type: 'bishop', colour: 'white', oldX: 7, oldY: 5, newX: 6, newY: 6 });
            expect(response2.response).toBeTruthy();
            expect(response.check[1]).toBeFalsy();
            socFunc({ player: 1, type: 'bishop', colour: 'black', oldX: 6, oldY: 6, newX: 1, newY: 1 });
            expect(response.response).toBeTruthy();
            expect(response.check[1]).toBeTruthy();
        });
        it('Queen', function(){
            chess.setBoard([['0', '0', '0', '0', '0', '0', '0', 'k1'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', 'q1', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', 'k2', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0']]);
            socFunc({ player: 1, type: 'queen', colour: 'black', oldX: 4, oldY: 2, newX: 4, newY: 3 });
            expect(response.response).toBeTruthy();
            expect(response.check[1]).toBeFalsy();
            socFunc2({ player: 2, type: 'king', colour: 'white', oldX: 4, oldY: 2, newX: 4, newY: 3 });
            expect(response2.response).toBeFalsy();
        });
        it('King', function(){
            chess.setBoard([['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', 'k1', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', 'k2', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0']]);
            socFunc2({ player: 2, type: 'king', colour: 'white', oldX: 4, oldY: 2, newX: 4, newY: 3 });
            expect(response2.response).toBeFalsy();
            expect(response.check[0]).toBeFalsy();
            expect(response.check[1]).toBeFalsy();
        });
    });
    describe('Checkmate', function() {
        var gameover = false;
        beforeEach(function () {
            chess = new GameServer.ChessInstance(id);
            mockClient = {
                emit: function (name, msg) {
                    emitName = name;
                    response = msg;
                    if(name === "GameOver"){
                        gameover = true;
                    }
                },
                on: function (name, func) {
                    onName = name;
                    socFunc = func;
                }
            };
            mockClient2 = {
                emit: function (name, msg) {
                    emitName2 = name;
                    response2 = msg;
                    if(name === "GameOver"){
                        gameover = true;
                    }
                },
                on: function (name, func) {
                    onName2 = name;
                    socFunc2 = func;
                }
            };
            chess.addPlayer(mockClient, "mock");
            chess.addPlayer(mockClient2, "mock2");
        });
        it('Player 1', function(){
            chess.setBoard([['k2', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', 'r2', '0'],
                ['0', '0', '0', '0', 'b2', 'r2', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', 'k1']]);
            socFunc2({ player: 2, type: 'bishop', colour: 'white', oldX:3, oldY: 1, newX: 2, newY: 2 });
            expect(response2.response).toBeTruthy();
            expect(response2.check[0]).toBeTruthy();
            expect(gameover).toBeTruthy();
        });
        it('Player 2', function(){
            chess.setBoard([['k1', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0', 'r1', '0'],
                ['0', '0', '0', '0', 'b1', 'r1', '0', '0'],
                ['0', '0', '0', '0', '0', '0', '0', 'k2']]);
            socFunc({ player: 1, type: 'bishop', colour: 'black', oldX:4, oldY: 6, newX: 5, newY: 5 });
            expect(response.response).toBeTruthy();
            expect(response.check[1]).toBeTruthy();
            expect(gameover).toBeTruthy();
        });
    });
    function compareBoards(b, b2){
        var i,j;
        for(i = 0; i < 7; i++){
            for(j = 0; j < 7; j++){
                if(b[i][j] !== b2[i][j]){
                    return false;
                }
            }
        }
        return true;
    }
}());