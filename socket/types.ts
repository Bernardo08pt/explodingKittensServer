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
    players: Array<string>;
    owner: string;
}

export interface SocketsConnected {
    [key: string]: User;
}

export interface RoomsCreated {
    [key: string]: Room;
}