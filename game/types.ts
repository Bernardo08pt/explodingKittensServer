interface Card {
    name: string;
    effect: string;
}

interface Player {
    username: string;
    cards: Array<Card>;
    isAlive: boolean;
}

interface GameState {
    cardsRemaining: Array<Card>;
    discardPile: Array<Card>;
    players: Array<Player>;
    playerTurn: string;
}

interface SanitizedGameState {
    cardsRemaining: number;
    discardPile: Array<Card>;
    players: Array<SanitizedPlayer>;
    playerTurn: string;
}

interface SanitizedPlayer {
    username: string;
    cards: number;
    isAlive: boolean;
}