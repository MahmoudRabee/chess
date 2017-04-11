/**
 * Created by Geoff on 3/22/2017.
 * banner facotry, consider refactor into private obj from board or html div
 */
'use strict';

Classes.factory("Banner", [function () {
    function Banner() {
        this.background = new createjs.Shape();
        this.background.graphics.beginFill("#fefefe").drawRect(105, 300, 510, 120);
        this.border = new createjs.Shape();
        this.border.graphics.beginFill("#131313").drawRect(100, 295, 520, 130);
        this.text = new createjs.Text("", "45px Arial", "#191919");
        this.text.x = 115;
        this.text.y = 375;
        this.text.textBaseline = "alphabetic";
        this.container = new createjs.Container();
        this.background.zIndex = 11;
        this.border.zIndex = 10;
        this.text.zIndex = 12;

        this.addToStage = function (stage) {
            stage.addChild(this.container);
            this.container.addChild(this.border);
            this.container.addChild(this.background);
            this.container.addChild(this.text);
            this.container.name = "banner";
        };
        this.visible = function (bool){
            this.background.visible = bool;
            this.border.visible = bool;
            this.text.visible = bool;
        };
        this.changeText = function(text){
            this.text.text = text;
            this.text.x = 360 - (this.text.getBounds()).width/2;
            this.text.y = 370;
        };
        this.addEventListener = function (type, listener){

        };
        this.removeEventListener = function (type, listener){

        };
        this.removeFromStage = function (stage) {
            stage.removeChild(this.background);
            stage.removeChild(this.text);
        };
    }
    return (Banner);
}]);