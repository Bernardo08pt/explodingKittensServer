export interface SocketModule {
    init: (io: any) => void;
}

export interface User {
    id: string;
    username: string;
}

export interface Room {
    id: string;
    number: number;
    maxPlayers: number;
    players: Array<string>;
    owner: string;
    hasGameStarted: boolean;
    game: GameState | null
}

export interface SocketsConnected {
    [key: string]: User;
}

export interface RoomsCreated {
    [key: string]: Room;
}