'use strict';
Services.service('loaderSvc', function () {
    var manifest = [
            {src: "chessboard.png", id: "board"},
            {src: "pawnBlack.png", id: "pawnblack"},
            {src: "rookBlack.png", id: "rookblack"},
            {src: "knightBlack.png", id: "knightblack"},
            {src: "bishopBlack.png", id: "bishopblack"},
            {src: "queenBlack.png", id: "queenblack"},
            {src: "kingBlack.png", id: "kingblack"},
            {src: "pawnWhite.png", id: "pawnwhite"},
            {src: "rookWhite.png", id: "rookwhite"},
            {src: "knightWhite.png", id: "knightwhite"},
            {src: "bishopWhite.png", id: "bishopwhite"},
            {src: "queenWhite.png", id: "queenwhite"},
            {src: "kingWhite.png", id: "kingwhite"}

        ],

        loader = new createjs.LoadQueue(true);
    createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin]);  // need this so it doesn't default to Web Audio
    loader.installPlugin(createjs.Sound);
    this.getResult = function (asset) {
        return loader.getResult(asset);
    };
    this.getLoader = function () {
        return loader;
    };
    this.loadAssets = function () {
        loader.loadManifest(manifest, true, "/assets/");
    };
});