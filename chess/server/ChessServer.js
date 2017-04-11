var GameServer = require("./ChessInstance.js");
module.exports.GameCoordinator = function GameCoordinator(){
        var games = [];
        var currGame = 0;
        this.connect = function(client){

            client.on('connectGame', function(msg){
                if(msg.opponent !== null){
                    var id = getGame(msg.opponent);
                    if(id === null){
                        client.emit("failedGameConnect");
                    }else{
                        games[id].addPlayer(client);
                    }
                }else {
                    if (games[currGame] === undefined || games[currGame] === null) {
                        games[currGame] = new GameServer.ChessInstance(currGame);
                    }
                    games[currGame].addPlayer(client, msg.name);
                    if(games[currGame].getNumPlayers() === 2){
                        console.log("Game session started, id: " + currGame);
                        currGame++;
                    }
                }
            });
            //future feature for private matches
            function getGame(playerId){
                var i;
                var result = null;
                for(i = 0; i < games.length; i++){
                    if(games[i].getPlayerId() === playerId){
                        result = games[playerId]
                    }
                }
                return result;
            }
            function getPlayerId(){
                return null;
            }
        }
    };

