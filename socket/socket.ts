import { Socket } from 'socket.io';
import GameModule from '../game/game';
import { RoomsCreated, SocketModule, SocketsConnected, User } from './types';

const uuidv4 = () => 
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });


const socketModule: SocketModule = {
    init: (io) => {
        let sockets: SocketsConnected = {}; 
        let rooms: RoomsCreated = {}; 

        io.on('connection', (client: Socket) => {
            client.emit('connected', { "id": client.id });
                
            client.on("checkIfLoggedIn", (data: User) => {
                const { username } = data;
                const registeredSocket = Object.keys(sockets).find(key => sockets[key].username === username);
                let room = null;

                if (registeredSocket) {
                    const { id } = client;

                    delete(sockets[registeredSocket]);

                    sockets[id] = {
                        id,
                        username
                    }

                    const roomId = Object.keys(rooms).find(key => rooms[key].players.findIndex(player => player === username) > -1);

                    if (roomId) {
                        client.join(roomId);
                        room = {...rooms[roomId], game: GameModule.sanitizeGameState(rooms[roomId].game)};
                    }
                } 

                client.emit("checkIfLoggedInResult", { loggedIn: !!registeredSocket, room});
            });

            client.on('register', (data: User) => {
                const { username } = data;
                const registeredSocket = Object.keys(sockets).find(key => sockets[key].username === username);
    
                if (!registeredSocket) {
                    const { id } = client;
                    sockets[id] = {
                        id,
                        username: username
                    }
                }   
    
                client.emit("registerResult", registeredSocket ? null : username);
            });

            client.on('createRoom', () => {
                const { username } = sockets[client.id];
                const id = uuidv4();

                rooms[id] = {
                    id,
                    number: ++Object.keys(rooms).length,
                    maxPlayers: 4,
                    players: [username],
                    owner: username,
                    hasGameStarted: false,
                    game: null
                }
                
                client.join(id);
                client.emit('enterRoomResponse', rooms[id]);
                client.broadcast.emit('newRoomCreated', rooms[id]);
                client.emit('getRoomsResponse', rooms);
            });

            client.on('enterRoom', (roomId: string) => {
                const room = rooms[roomId];

                if (room.players.length < room.maxPlayers && !room.hasGameStarted) {
                    const { username } = sockets[client.id];
                    room.players.push(username);
                
                    client.join(roomId);
                    client.emit('enterRoomResponse', room);
                    client.to(roomId).broadcast.emit('newPlayerJoined', username);
                    client.broadcast.emit('getRoomsResponse', Object.keys(rooms).map(key => ({...rooms[key], game: null})));
                } else {
                    client.emit('enterRoomResponse', null);
                }
            });

            client.on('getRooms', () => {
                const allRooms = Object.keys(rooms).map(key => ({...rooms[key], game: null}));

                client.emit('getRoomsResponse', allRooms);
            });

            client.on('leaveRoom', (roomId: string) => {
                const { username } = sockets[client.id];

                rooms[roomId].players = rooms[roomId].players.filter(player => player !== username);

                client.emit('leaveRoomResponse');
                client.leave(roomId);
                client.to(roomId).broadcast.emit('playerLeft', username);
                client.broadcast.emit('getRoomsResponse', Object.keys(rooms).map(key => ({...rooms[key], game: null})));
            });

            client.on('startGame', (roomId: string) => {
                const { username } = sockets[client.id];
                const room = rooms[roomId];

                if (room.owner === username && room.players.length > 1) {
                    room.hasGameStarted = true;
                    room.game = GameModule.init(room.players);
                    io.in(roomId).emit("startGameResponse", GameModule.sanitizeGameState(room.game))    
                }
            });
        })
    }
}

export default socketModule;