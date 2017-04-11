'use strict';
module.exports = {
    ChessInstance: function(id)
    {
        var player1;
        var player2;
        var numPlayers = 0;
        var turn = 0;
        var gameId = id;
        var board = [['r2', 'n2', 'b2', 'k2', 'q2', 'b2', 'n2', 'r2'],
            ['p2', 'p2', 'p2', 'p2', 'p2', 'p2', 'p2', 'p2'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1', 'p1'],
            ['r1', 'n1', 'b1', 'k1', 'q1', 'b1', 'n1', 'r1']];
        /**
         * Public functions
         */
        /**
         * Creates the socket.io events for player
         * @param client - socket.io socket to the client
         */
        this.addPlayer = function (client) {

            if(numPlayers === 0){
                player1 = client;
            }else{
                player2 = client;
            }
            client.on('move', function (data) {
                movePiece(data);
            });
            numPlayers++;
            var msg = {
                player:numPlayers,
                gameId:gameId
            };
            client.emit('initResponse', msg);
            if (numPlayers === 2) {
                start();
            }
        };
        /**
         * Get method for the number of player for this game instance
         * @returns {number}
         */
        this.getNumPlayers = function () {
            return numPlayers;
        };
        /**
         * For testing and future features
         * @param newBoard
         */
        this.setBoard = function(newBoard){
            board = newBoard;
            turn = 1;
        };
        /**
         * Private functions
         */
        /**
         * Messages both players that game is ready, send board data
         */
        function start() {
            var msg = {
                "turn": 1,
                "board": board
            };
            turn = 1;
            player1.emit('startGame', msg);
            msg.board = flipBoard();
            player2.emit('startGame', msg);
        }

        /**
         * Returns a flipped version of the current board state, for player 2 reconnect
         * @returns {[*,*,*,*,*,*,*,*]} -this is a board
         */
        function flipBoard(){
            var i, j, b = [[],[],[],[],[],[],[],[]], x=7,y=7;
            for(i = 0; i < 8; i++){
                for(j = 0; j < 8; j++) {
                    if(x < 0){
                        y--;
                        x=7;
                    }
                    b[i][j] = board[y][x];
                    x--;
                }
            }
            return b;
        }
        /**
         * Flips positional data for player2
         * @param msg -
         * {"player": player,
         *   "type": piece.type,
         *   "colour": piece.colour,
         *   "oldX": piece.posX, "oldY": piece.posY,
         *   "newX": newPosX, "newY": newPosY}
         * @returns msg
         */
        function flipPos(msg) {
            msg.oldX = 7 - msg.oldX;
            msg.oldY = 7 - msg.oldY;
            msg.newX = 7 - msg.newX;
            msg.newY = 7 - msg.newY;
            return msg;
        }

        /**
         *  Called when client emits a move command
         * @param move -
         * {"player": player,
         *   "type": piece.type,
         *   "colour": piece.colour,
         *   "oldX": piece.posX, "oldY": piece.posY,
         *   "newX": newPosX, "newY": newPosY}
         */
        function movePiece(move) {
            if (move.player === 2) {
                flipPos(move);
            }
            var msg = {
                "turn": turn,
                "response": false,
                "oldX": move.oldX, "oldY": move.oldY,
                "newX": move.newX, "newY": move.newY,
                "check": [false,false]
            };
            if (isLegal(move) && getPiece(move.oldX, move.oldY) !== null) {
                msg.response = updateBoard(move);
            }
            if (numPlayers < 2) {
                msg.response = false;
            }
            msg.check = isAPlayerInCheck();
            if(msg.check[0]){
                if(isCheckMate(move,0)){
                    player1.emit("GameOver", 2);
                    player2.emit("GameOver", 2);
                }
            }else if(msg.check[1]){
                if(isCheckMate(move,1)){
                    player1.emit("GameOver", 1);
                    player2.emit("GameOver", 1);

                }
            }
            player1.emit('moveResponse', msg);
            flipPos(msg);
            player2.emit('moveResponse', msg);
            if(msg.response){
                turn++;
            }
        }

        /**
         * Locates both kings returns their positions
         * @returns {[*,*]} - array of size 2 with 2 kings objs
         */
        function findKings(){
            var kings = [ null, null ], i, j;
            for (i = 0; i < 8; i++) {
                for (j = 0; j < 8; j++) {
                    if(board[j][i].charAt(0) === 'k'){
                        kings[board[j][i].charAt(1) - 1] = {
                            "x" : i,
                            "y" : j
                        };

                    }
                }
            }
            return kings;
        }

        /**
         * Gets the piece at position x,y then builds a client json
         * @param x
         * @param y
         * @returns {*}
         */
        function getPiece(x,y){
            var piece, type, colour, player;
            piece = board[y][x];
            if(piece === "0"){
                return null;
            }
            type = piece.charAt(0);
            colour = piece.charAt(1);
            player = colour;
            if(type === 'p'){
                type = "pawn";
            }else if(type === 'r'){
                type = "rook";
            }else if(type === 'n'){
                type = "knight";
            }else if(type === 'b'){
                type = "bishop";
            }else if(type === 'q'){
                type = "queen";
            }else{
                type= "king";
            }
            if(colour === "1"){
                colour = "black";
            }else{
                colour = "white";
            }
            piece = {
                "player": player,
                "colour":colour,
                "type": type,
                "posX": x,
                "posY": y
            };
            return piece;
        }

        /**
         * Determines if king is in checkmate by trying all methods to save him.
         * If all methods fail, game ends, otherwise game continues.
         * @param move - move that caused check
         * @param playerInCheck
         * @returns {boolean} - true if player's king is in checkmate
         */
        function isCheckMate(move, playerInCheck){
            //todo: check all possible moves and if they remove the check
            var attacker = {"x":move.newX, "y":move.newY};
            var king = findKings()[playerInCheck];
            return !(tryToMoveKing(king) ||  tryToStopAttacker(attacker, king));
        }

        /**
         * Trie to move a piece in the way of the attacker or kill the attacker with every friendly piece
         * @param attacker
         * @param king
         * @returns {boolean} -true if any move stops check
         */
        function tryToStopAttacker(attacker, king){
            var player = board[attacker.y][attacker.x].charAt(1);
            var piece, move, i,j,k, path;
            for(i = 0; i < 8; i++){
                for(j = 0; j < 8; j++){
                    piece = getPiece(j, i);
                    if (piece !== null && piece.player !== player) {
                        path = getPath(king.x, king.y, attacker.x, attacker.y);
                        move = {
                            "player": piece.player,
                            "type": piece.type,
                            "colour": piece.colour,
                            "oldX": piece.x, "oldY": piece.y,
                            "newX": attacker.x, "newY": attacker.y
                        };
                        if (isLegal(move) && !isAPlayerInCheck()[move.player - 1]) {
                            return true;
                        }
                        for(k = 0; k < path.length; k++) {
                            move.newX = path[k].x;
                            move.newY = path[k].y;
                            if (isLegal(move) && !isAPlayerInCheck()[move.player - 1]) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }
        /**
         * Tries to move the king to the 8 spaces around him
         * min-max is for edge cases, does not allow king to move into check
         * @param king - position of king in check (x,y)
         * @returns {boolean} - returns true if there is a possible move
         */
        function tryToMoveKing(king){
            var i,j, minX, minY, maxX, maxY, move, piece;
            minX = king.x - 1;
            maxX = king.x + 1;
            minY = king.y - 1;
            maxY = king.y + 1;
            if(minX < 0)
                minX = 0;
            if(maxX > 7)
                maxX = 7;
            if(minY < 0)
                minY = 0;
            if(maxY > 7)
                maxY = 7;
            piece = getPiece(king.x,king.y);
            move = {
                "player": piece.player,
                "type": piece.type,
                "colour": piece.colour,
                "oldX": king.x, "oldY": king.y,
                "newX": 0, "newY": 0
            };
            for(i = minY; i < maxY; i++){
                for(j = minX; j < maxX; j++){
                    if(!(j === king.x && i === king.y)) {
                        move.newX = j;
                        move.newY = i;
                        if (isLegal(move) && !isAPlayerInCheck()[move.player - 1]) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        /**
         * Checks if each player is in check returns the result for both players
         * in a 2 length array, tries to move every piece to the king's position
         * (not elegant but does the trick)
         * @returns {[boolean,boolean]}
         */
        function isAPlayerInCheck(){
            var kings, i, j, move, piece, player, check = [false,false];
            kings = findKings();
            if(kings[0] !== null && kings[1] !== null) {
                for (player = 0; player < 2; player++) {
                    for (i = 0; i < 8; i++) {
                        for (j = 0; j < 8; j++) {
                            piece = getPiece(i, j);
                            if (piece !== null && piece.player - 1 !== player) {
                                move = {
                                    "player": piece.player,
                                    "type": piece.type,
                                    "colour": piece.colour,
                                    "oldX": piece.posX, "oldY": piece.posY,
                                    "newX": kings[player].x, "newY": kings[player].y
                                };
                                if (isLegal(move)) {
                                    check[player] = true;
                                }
                            }
                        }
                    }
                }
            }
            return check;
        }
        /**
         * Determines if given move is legal or not
         * @param move -
         * {"player": player,
         *   "type": piece.type,
         *   "colour": piece.colour,
         *   "oldX": piece.posX, "oldY": piece.posY,
         *   "newX": newPosX, "newY": newPosY}
         * @returns {boolean}
         */
        function isLegal(move) {
            var newPos = board[move.newY][move.newX];
            var deltaX = move.newX - move.oldX, deltaY = move.newY - move.oldY;
            if (move.type === "pawn") {
                if (((move.colour === "black" && (deltaY === -1 || (move.oldY === 6 && deltaY === -2)))
                    || (move.colour === "white" && (deltaY === 1 || (move.oldY === 1 && deltaY === 2)))))
                {
                    if ((Math.abs(deltaX) === 1 && newPos !== '0')
                        || (deltaX === 0 && newPos === '0')) {
                        return isEnemy(move);
                    }
                }
            } else if (move.type === "rook") {
                if (deltaY * deltaX === 0 && isPathClear(move.oldX, move.oldY, move.newX, move.newY)) {
                    return isEnemy(move);
                }
            } else if (move.type === "knight") {
                if ((Math.abs(deltaY) === 1 && Math.abs(deltaX) === 2)
                    || (Math.abs(deltaY) === 2 && Math.abs(deltaX) === 1)) {
                    return isEnemy(move);
                }
            } else if (move.type === "bishop") {
                if (Math.abs(deltaX / deltaY) === 1 && isPathClear(move.oldX, move.oldY, move.newX, move.newY)) {
                    return isEnemy(move);
                }
            } else if (move.type === "queen") {
                if (((Math.abs(deltaX / deltaY) === 1) || (deltaY * deltaX === 0))
                    && isPathClear(move.oldX, move.oldY, move.newX, move.newY)) {
                    return isEnemy(move);
                }

            } else if (move.type === "king") {
                if ((Math.abs(deltaX) <= 1) && (Math.abs(deltaY) <= 1)){
                    return isEnemy(move);
                }
            }
            return false;
        }

        /**
         * Returns true if path from start to end is only "0" uses getPath which fails if any space is non empty
         * @param startX
         * @param startY
         * @param endX
         * @param endY
         * @returns {boolean}
         */
        function isPathClear(startX, startY, endX, endY){
            return (getPath(startX, startY, endX, endY) !== null);
        }
        /**
         * Builds a Path array which is all the spaces in a path if path is blocked returns null
         * @param startX
         * @param startY
         * @param endX
         * @param endY
         * @returns {[]}
         */
        function getPath(startX, startY, endX, endY) {
            var i, x, y, distance, deltaX, deltaY, path = [], count = 0;
            deltaX = Math.sign(endX - startX);
            deltaY = Math.sign(endY - startY);
            x = startX;
            y = startY;
            distance = Math.abs(endX - startX);
            if (distance === 0) {
                distance = Math.abs(endY - startY);
            }
            for (i = 0; i < distance - 1; i++) {
                x = x + deltaX;
                y = y + deltaY;
                path[count] = {"x":x, "y": y};
                count++;
                if (board[y][x] !== '0') {
                    return null;
                }

            }
            return path;
        }

        /**
         * Determines of the piece at newX,Y belongs to the player who made the move
         * empty spaces are always enemies
         * @param move -
         * {"player": player,
         *   "type": piece.type,
         *   "colour": piece.colour,
         *   "oldX": piece.posX, "oldY": piece.posY,
         *   "newX": newPosX, "newY": newPosY}
         * @returns {boolean} -true if new pos is enemy
         */
        function isEnemy(move) {
            if (board[move.newY][move.newX] !== '0') {
                if ((board[move.newY][move.newX]).charAt(1) === (board[move.oldY][move.oldX]).charAt(1)) {
                    return false;
                }
            }
            return true;
        }

        /**
         * Actual Move of the piece on board, checks if moves result is illegal
         * @param move -
         * {"player": player,
         *   "type": piece.type,
         *   "colour": piece.colour,
         *   "oldX": piece.posX, "oldY": piece.posY,
         *   "newX": newPosX, "newY": newPosY}
         * @returns {boolean}
         */
        function updateBoard(move) {
            var temp, checks;
            temp = board[move.newY][move.newX];
            board[move.newY][move.newX] = board[move.oldY][move.oldX];
            board[move.oldY][move.oldX] = '0';
            checks = isAPlayerInCheck();
            if((checks[0] && move.player === 1) || (checks[1] && move.player === 2)){
                board[move.oldY][move.oldX] = board[move.newY][move.newX];
                board[move.newY][move.newX] = temp;
                return false;
            }
            return true;
        }
    }
};
