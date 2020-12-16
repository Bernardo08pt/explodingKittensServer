"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __importDefault(require("../game/game"));
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
                        room = __assign(__assign({}, rooms[roomId]), { game: game_1.default.sanitizeGameState(rooms[roomId].game) });
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
                    maxPlayers: 4,
                    players: [username],
                    owner: username,
                    hasGameStarted: false,
                    game: null
                };
                client.join(id);
                client.emit('enterRoomResponse', rooms[id]);
                client.broadcast.emit('newRoomCreated', rooms[id]);
                client.emit('getRoomsResponse', rooms);
            });
            client.on('enterRoom', function (roomId) {
                var room = rooms[roomId];
                if (room.players.length < room.maxPlayers && !room.hasGameStarted) {
                    var username = sockets[client.id].username;
                    room.players.push(username);
                    client.join(roomId);
                    client.emit('enterRoomResponse', room);
                    client.to(roomId).broadcast.emit('newPlayerJoined', username);
                    client.broadcast.emit('getRoomsResponse', Object.keys(rooms).map(function (key) { return (__assign(__assign({}, rooms[key]), { game: null })); }));
                }
                else {
                    client.emit('enterRoomResponse', null);
                }
            });
            client.on('getRooms', function () {
                var allRooms = Object.keys(rooms).map(function (key) { return (__assign(__assign({}, rooms[key]), { game: null })); });
                client.emit('getRoomsResponse', allRooms);
            });
            client.on('leaveRoom', function (roomId) {
                var username = sockets[client.id].username;
                rooms[roomId].players = rooms[roomId].players.filter(function (player) { return player !== username; });
                client.emit('leaveRoomResponse');
                client.leave(roomId);
                client.to(roomId).broadcast.emit('playerLeft', username);
                client.broadcast.emit('getRoomsResponse', Object.keys(rooms).map(function (key) { return (__assign(__assign({}, rooms[key]), { game: null })); }));
            });
            client.on('startGame', function (roomId) {
                var username = sockets[client.id].username;
                var room = rooms[roomId];
                if (room.owner === username && room.players.length > 1) {
                    room.hasGameStarted = true;
                    room.game = game_1.default.init(room.players);
                    io.in(roomId).emit("startGameResponse", game_1.default.sanitizeGameState(room.game));
                }
            });
            client.on('getCards', function (roomId) {
                var _a, _b;
                var username = sockets[client.id].username;
                var room = rooms[roomId];
                client.emit("getCardsResponse", (_b = (_a = room.game) === null || _a === void 0 ? void 0 : _a.players.find(function (player) { return player.username === username; })) === null || _b === void 0 ? void 0 : _b.cards);
            });
            client.on('drawCard', function (roomId) {
                var username = sockets[client.id].username;
                var room = rooms[roomId];
                if (!room.game) {
                    return;
                }
                var newGameState = game_1.default.drawCard(room.game, username);
                if (!!newGameState) {
                    room.game = newGameState;
                    io.in(roomId).emit("updateGameState", game_1.default.sanitizeGameState(newGameState));
                }
            });
            client.on('playCard', function (data) {
                var roomId = data.roomId, card = data.card;
                var username = sockets[client.id].username;
                var room = rooms[roomId];
                if (!room.game) {
                    return;
                }
                var newGameState = game_1.default.playCard(room.game, username, card);
                if (!!newGameState) {
                    room.game = newGameState;
                    io.in(roomId).emit("updateGameState", game_1.default.sanitizeGameState(newGameState));
                }
            });
        });
    }
};
exports.default = socketModule;
