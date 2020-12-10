"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socketModule = {
    init: function (io) {
        var players = {};
        var sockets = {};
        var games = {};
        console.log(1);
        io.on('connection', function (client) {
            console.log("connected : " + client.id);
            client.emit('connected', { "id": client.id });
            client.on('register', function (data) {
                var username = data.username;
                var registeredSocket = Object.keys(sockets).find(function (key) { return sockets[key].username === username; });
                if (!registeredSocket) {
                    sockets[client.id] = {
                        username: username
                    };
                    var registeredPlayer = Object.keys(players).find(function (key) { return key === username; });
                    if (!registeredPlayer) {
                        players[username] = {
                            played: 0,
                            won: 0,
                            draw: 0
                        };
                    }
                }
                client.emit('registerResult', !registeredSocket);
            });
        });
    }
};
module.exports = socketModule;
