/**
 * Created by Geoff on 2/18/2017.
 * factory for boards, each object stores a local copy of board state in piece objects for reference
 */
'use strict';
Classes.factory("Board", ['loaderSvc', 'Socket', 'Piece', function (loaderSvc, Socket, Piece) {
    function Board(obj) {
        this.stage = null;
        this.bitmap  = new createjs.Bitmap(loaderSvc.getResult("board"));
        //todo replace with bitboard
        this.pieceArray = [[], [], [], [], [], [], [], []];
        this.text = new createjs.Text("gameID:", "12px Arial", "#191919");
        this.setID = function(text){
            this.text.text = "gameID:" + text;
        };
        this.addToStage = function (stage) {
            this.stage = stage;
            stage.addChild(this.bitmap);
            stage.addChild(this.text);
            this.bitmap.board = this;
        };
        this.removeFromStage = function (stage) {
            stage.removeChild(this.bitmap);
            this.stage = null;
        };
        this.movePiece = function (piece, newPosX, newPosY, w) {
            if (this.pieceArray[newPosY][newPosX] !== undefined
                && this.pieceArray[newPosY][newPosX] !== null) {
                this.pieceArray[newPosY][newPosX].removeFromStage(this.stage);
            }
            this.pieceArray[newPosY][newPosX] = piece;
            this.pieceArray[piece.posY][piece.posX] = null;
            piece.setPos(newPosX, newPosY, w);
        };
        this.create = function (board, events, player ,w) {
            var i, j, colour, type;
            for (i = 0; i < 8; i++) {
                for (j = 0; j < 8; j++) {
                    if (board[i][j].charAt(0) === 'p') {
                        type = "pawn";
                    } else if (board[i][j].charAt(0) === 'r') {
                        type = "rook";
                    } else if (board[i][j].charAt(0) === 'n') {
                        type = "knight";
                    } else if (board[i][j].charAt(0) === 'b') {
                        type = "bishop";
                    } else if (board[i][j].charAt(0) === 'q') {
                        type = "queen";
                    } else if (board[i][j].charAt(0) === 'k') {
                        type = "king";
                    }
                    if (board[i][j] !== '0') {
                        if (board[i][j].charAt(1) === '1') {
                            colour = "black";
                        } else {
                            colour = "white";
                        }
                        this.pieceArray[i][j] = new Piece(type, colour);
                        this.pieceArray[i][j].addToStage(this.stage);
                        this.pieceArray[i][j].addEventListener("pressmove", events.handleDrag);
                        this.pieceArray[i][j].addEventListener("pressup", events.handleRelease);
                        this.pieceArray[i][j].setPos(j, i, w);
                    }

                }
            }
        };
        this.clear = function (events) {
            var i, j;
            for (i = 0; i < 8; i++) {
                for (j = 0; j < 8; j++) {
                    if (this.pieceArray[i][j]) {
                        this.pieceArray[i][j].removeFromStage(this.stage);
                        this.pieceArray[i][j].removeEventListener("pressmove", events.handleDrag);
                        this.pieceArray[i][j].removeEventListener("pressup", events.handleRelease);
                    }
                }
            }
        };

    }
    return (Board);
}]);