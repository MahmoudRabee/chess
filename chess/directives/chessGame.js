/**
 *   Created by Geoff
 *  This defines the div chessGame which hold the local game logic for game
 *
 */
Directives.directive('chessGame', ['loaderSvc', 'GameEngine', 'Socket', '$window',
    function (loaderSvc, GameEngine, Socket, $window) {
        "use strict";
        return {
            restrict : 'EAC',
            replace : true,
            scope :{
                width: '=width',
                height: '=height',
            },
            template: "<canvas></canvas>",
            link: function (scope, element, attribute) {
                var w, h, socket = new Socket();
        		var container = new createjs.Container();

                buildStage();
                scope.stage.addChild(container);
                setWindowDimensions();
                angular.element($window).bind('resize', function(){
                    setWindowDimensions();
                });

                function buildStage() {
                    if (scope.stage) {
                        scope.stage.autoClear = true;
                        scope.stage.removeAllChildren();
                        scope.stage.update();
                    } else {
                        scope.stage = new createjs.Stage(element[0]);
                    }
                    loaderSvc.getLoader().addEventListener("complete", loadComplete);
                    loaderSvc.loadAssets();
                }
                function loadComplete() {
                    GameEngine.buildGame(container, socket, w ,h);
                    createjs.Ticker.timingMode = createjs.Ticker.RAF;
                    createjs.Ticker.addEventListener("tick", tick);
                    scope.$apply();
                }
                function setWindowDimensions(){
                    var margin;
                    w = $window.innerWidth;
                    h = $window.innerHeight - 150;
                    if(w > h){
                        w = h;
                    }else{
                        h = w;
                    }
                    element[0].width = w;
                    element[0].height = h;
                    container.width = w;
                    container.height = h;
                    container.scaleX = w/720;
                    container.scaleY = h/720;
                    margin = (($window.innerWidth-w))/2  + "px";
                    console.log(margin);
                    if(margin < 0){
                        margin = "0px";
                    }
                    element.css("margin-left", margin);
                }
                function tick(event) {
                    scope.stage.update(event);
                    GameEngine.tick();

                }
            }
        }
    }]);
