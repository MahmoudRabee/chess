/**
 *   Created by Geoff
 *  This contains all local logic and communication with server
 *
 */
'use strict';
Services.service('GameEngine', ['loaderSvc', 'Board', 'Banner',
    function (loaderSvc, Board, Banner) {
        var turn = -1, piece = null, player, bannerCount = -1, check = false;
        var board, container;
        var server, gameover = false;
        var banner = new Banner();
        /**
         * Public functions
         */
        this.buildGame = function(stage, socket){
            server = socket;
            container = stage;
            board = new Board({width:container.width, height:container.height});
            board.addToStage(container);
            banner.changeText("Waiting For Other Player");
            banner.addToStage(container);
            server.connect();
            defineSocketEvents();
        };
        this.tick = function() {
            if(bannerCount > 0 && !gameover){
                bannerCount--;
            }else if(bannerCount === 0){
                banner.visible(false);
                bannerCount = -1;
            }
        };
        /**
         * Determines player turn and which pieces are the player's
         * @param event
         * @returns {boolean}
         */
        function checkIfPieceAndTurnIsYours(event){
             return turn > 0 && ((player === 2 && turn % 2 === 0) || (player === 1 && turn % 2 !== 0))
                && ((event.target.piece.colour === "black" && player === 1)
                || (event.target.piece.colour === "white" && player === 2));

        }
        /**
         * UI event definitions
         */
        /**
         * Called when player grabs and drags a UI element
         * @param event
         */
        function handleDrag(event){
            if(checkIfPieceAndTurnIsYours(event)) {
                event.target.x = (event.stageX / (container.width/720)) - 30;
                event.target.y = (event.stageY / (container.height/720)) - 50;
            }
        }

        /**
         * Called when mouse is released on UI element
         * @param event
         */
        function handleRelease(event){
            var  msg, newPosX, newPosY;
            if(checkIfPieceAndTurnIsYours(event)) {
                piece = event.target.piece;
                newPosX = Math.floor(((event.stageX / (container.width/720)) / 720) * 8);
                newPosY = Math.floor(((event.stageY / (container.height/720)) / 720) * 8);
                msg = {
                    "player": player,
                    "type": piece.type,
                    "colour": piece.colour,
                    "oldX": piece.posX, "oldY": piece.posY,
                    "newX": newPosX, "newY": newPosY
                };
                if(msg.oldX !== msg.newX || msg.oldY !== msg.newY) {
                    server.emit('move', msg);
                }
            }
        }
        /**
         * Creates the listeners for Socket.io
         */
        function defineSocketEvents(){
            server.on('GameOver', function(){
                gameover = true;
            });
            server.on('connectionConfirmed', function(){
                server.emit('connectGame', {opponent:null, name:'anon'});
            });
            server.on('initResponse', function(msg){
                console.log("Connected to Game session id: " + msg.gameId + " player:" + msg.player);
                board.setID(msg.gameId);
                player = msg.player;

            });
            server.on('startGame', function(msg){
                var events;
                events = {
                    "handleDrag": handleDrag,
                    "handleRelease": handleRelease
                };
                board.clear();
                board.create(msg.board, events, player, container.width);
                console.log("Game Started");
                if((player === 2 && msg.turn % 2 === 0) || (player === 1 && msg.turn % 2 !== 0)) {
                    postMsg("Your Turn");
                }else{
                    bannerCount = 1;
                }
                turn = 1;
            });
            server.on('moveResponse', function (msg) {
                if (msg.response === true) {
                    piece = board.pieceArray[msg.oldY][msg.oldX];
                    turn = msg.turn;
                    board.movePiece(piece, msg.newX, msg.newY, container.width);
                    turn++;
                    if(msg.check[0] || msg.check[1]){
                        if(gameover){
                            postMsg("CHECKMATE!");
                        }else {
                            postMsg("Check");
                        }
                    }
                    check = msg.check[player-1];
                    if((player === 2 && turn % 2 === 0) || (player === 1 && turn % 2 !== 0)) {
                        if(gameover){
                            postMsg("CHECKMATE!");
                        }else {
                            postMsg("Your Turn");
                        }
                    }
                } else {

                        console.log("invalid move");
                    if((player === 2 && msg.turn % 2 === 0) || (player === 1 && msg.turn % 2 !== 0)) {
                        piece.setPos(msg.oldX, msg.oldY, container.width);
                        postMsg("Invalid Move");
                    }
                }

            });
        }
        function postMsg(text){
            banner.changeText(text);
            banner.visible(true);
            container.setChildIndex( banner.container, container.getNumChildren()-1);
            bannerCount = 50;
        }
    }]);