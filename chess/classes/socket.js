/**
 * Created by Geoff on 3/12/2017.
 * factory for wrapper sockets
 */
'use strict';

Classes.factory("Socket", function () {
    function Socket() {
        this.socket = null;
        this.on = function (eventName, callback) {
            this.socket.on(eventName, callback);
        };
        this.emit = function (eventName, packet, callback) {
            this.socket.emit(eventName, packet, callback);
        };
        this.connect = function(){
            var socket;
            this.socket = io();
            socket = this.socket;
            this.socket.on('connectionConfirmed', function() {
                console.log("Client connected...");
                socket.emit('whichGame', "chess");
            });

        };
    }
    return (Socket);
});