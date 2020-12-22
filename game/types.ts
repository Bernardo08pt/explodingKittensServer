type CardType = 
    "defuse"
    | "explosive"
    | "seeTheFuture"
    | "shuffle"
    | "favor"
    | "nope"
    | "skip"
    | "attack"
    | "tacoCat"
    | "catermelon"
    | "hairyPotatoCat"
    | "beardCat"
    | "rainbowCat"


interface Card {
    id?: number;
    name: string;
    type: CardType;
}

type CardQuantity = {
    card: Card;
    number: number;
}

interface GameParameters {
    numberExplosives: number;
    numberDefuses: number;
    cards: Array<CardQuantity>;
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
    numberOfTurns: number;
}

interface SanitizedGameState {
    cardsRemaining: number;
    discardPile: Array<Card>;
    players: Array<SanitizedPlayer>;
    playerTurn: string;
    numberOfTurns: number;
}

interface SanitizedPlayer {
    username: string;
    cards: number;
    isAlive: boolean;
}