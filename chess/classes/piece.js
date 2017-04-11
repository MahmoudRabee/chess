/**
 * Created by Geoff on 2/18/2017.
 */
'use strict';
Classes.factory("Piece", ['loaderSvc', function (loaderSvc) {
    function Piece(type, colour) {

        this.bitmap = new createjs.Bitmap(loaderSvc.getResult(type + colour));
        this.type = type;
        this.colour = colour;
        this.posX = 0;
        this.posY = 0;
        this.addToStage = function (stage) {
            stage.addChild(this.bitmap);
            this.bitmap.name = "piece";
        };
        this.addEventListener = function (type, listener) {
            this.bitmap.addEventListener(type, listener);
            this.bitmap.piece = this;
        };
        this.removeEventListener = function (type, listener) {
            this.bitmap.removeEventListener(type, listener);
        };
        this.removeFromStage = function (stage) {
            stage.removeChild(this.bitmap);
        };
        this.setPos = function (x, y) {
            this.bitmap.x = (x * (90)) + 15;
            this.bitmap.y = (y * (90));
            this.posX = x;
            this.posY = y;
        };

    }
    return (Piece);
}]);