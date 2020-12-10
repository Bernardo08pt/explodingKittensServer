"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuidv4 = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
var socketModule = {
    init: function (io) {
        var sockets = {};
        var rooms = {};
        io.on('connection', function (client) {
            client.emit('connected', { "id": client.id });
            client.on("checkIfLoggedIn", function (data) {
                var username = data.username;
                var registeredSocket = Object.keys(sockets).find(function (key) { return sockets[key].username === username; });
                var room = null;
                if (registeredSocket) {
                    var id = client.id;
                    delete (sockets[registeredSocket]);
                    sockets[id] = {
                        id: id,
                        username: username
                    };
                    var roomId = Object.keys(rooms).find(function (key) { return rooms[key].players.findIndex(function (player) { return player === username; }) > -1; });
                    if (roomId) {
                        client.join(roomId);
                        room = rooms[roomId];
                    }
                }
                client.emit("checkIfLoggedInResult", { loggedIn: !!registeredSocket, room: room });
            });
            client.on('register', function (data) {
                var username = data.username;
                var registeredSocket = Object.keys(sockets).find(function (key) { return sockets[key].username === username; });
                if (!registeredSocket) {
                    var id = client.id;
                    sockets[id] = {
                        id: id,
                        username: username
                    };
                }
                client.emit("registerResult", registeredSocket ? null : username);
            });
            client.on('createRoom', function () {
                var username = sockets[client.id].username;
                var id = uuidv4();
                rooms[id] = {
                    id: id,
                    number: ++Object.keys(rooms).length,
                    players: [username],
                    owner: username
                };
                client.join(id);
                client.emit('enterRoomResponse', rooms[id]);
                client.broadcast.emit('newRoomCreated', rooms[id]);
            });
            client.on('enterRoom', function (roomId) {
                var username = sockets[client.id].username;
                rooms[roomId].players.push(username);
                client.join(roomId);
                client.emit('enterRoomResponse', rooms[roomId]);
                client.to(roomId).broadcast.emit('newPlayerJoined', username);
            });
            client.on('getRooms', function () {
                var allRooms = Object.keys(rooms).map(function (key) { return rooms[key]; });
                client.emit('getRoomsResponse', allRooms);
            });
        });
    }
};
exports.default = socketModule;
