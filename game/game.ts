const allCards: { [key: string]: Card } = {
    "defuse": {
        name: "Defuse",
        type: "defuse"
    },
    "explosive": {
        name: "Explosive",
        type: "explosive"
    },
    "seeTheFuture": {
        name: "See the future",
        type: "seeTheFuture"
    },
    "shuffle": {
        name: "Shuffle",
        type: "shuffle"
    },
    "favor": {
        name: "Favor",
        type: "favor"
    },
    "nope": {
        name: "Nope",
        type: "nope"
    },
    "skip": {
        name: "Skip",
        type: "skip"
    },
    "attack": {
        name: "Attack",
        type: "attack"
    },
    "tacoCat": {
        name: "Taco Cat",
        type: "tacoCat"
    },
    "catermelon": {
        name: "Catermelon",
        type: "catermelon"
    },
    "hairyPotatoCat": {
        name: "Hairy Potato Cat",
        type: "hairyPotatoCat"
    },
    "beardCat": {
        name: "Beard Cat",
        type: "beardCat"
    },
    "rainbowCat": {
        name: "Rainbow Cat",
        type: "rainbowCat"
    }
}

const basicGameCards: Array<CardQuantity> = [
    {
        card: allCards["seeTheFuture"],
        number: 5
    },
    {
        card: allCards["shuffle"],
        number: 4
    },
    {
        card: allCards["favor"],
        number: 4
    },
    {
        card: allCards["nope"],
        number: 5
    },
    {
        card: allCards["skip"],
        number: 4
    },
    {
        card: allCards["attack"],
        number: 4
    },
    {
        card: allCards["tacoCat"],
        number: 4
    },
    {
        card: allCards["catermelon"],
        number: 4
    },
    {
        card: allCards["hairyPotatoCat"],
        number: 4
    },
    {
        card: allCards["beardCat"],
        number: 4
    },
    {
        card: allCards["rainbowCat"],
        number: 4
    },
]

const basicGame: GameParameters = {
    numberExplosives: 4,
    numberDefuses: 6,
    cards: basicGameCards
}

const shuffleArray = (array: Array<any>) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const advanceToNextPlayer = (gameState: GameState) => {
    const { players, playerTurn } = gameState;
    const nextPlayerPosition = players.findIndex(p => p.username === playerTurn) + 1;
    const lastPlayerPosition = players.length - 1;

    gameState.playerTurn = nextPlayerPosition > lastPlayerPosition 
        ? players[0].username 
        : players[nextPlayerPosition].username;

    return gameState;
}

const game = {
    init: (players: Array<string>): GameState => {
        const deck: Array<Card> = [];  
        
        basicGame.cards.forEach(cardQuantity => {
            for(let i = 0; i < cardQuantity.number; i++) {
                deck.push({...cardQuantity.card, id: deck.length + 1});
            }
        })

        shuffleArray(deck);

        let gamePlayers: Array<Player> = [];
        players.forEach(player => {
            let playerCards: Array<Card> = [];

            for (let i = 0; i < 7; i++) {
                const card = deck.pop();
                
                if (card) {
                    playerCards.push(card);
                }
            }

            playerCards.push({...allCards["defuse"]})
            
            gamePlayers.push({
                username: player,
                cards: playerCards,
                isAlive: true
            });
        });

        let numberDefusesInGame = players.length > 3 
            ? basicGame.numberDefuses - players.length
            : 2; 

        for(let i = 0; i < numberDefusesInGame; i++) {
            deck.push({...allCards["defuse"], id: deck.length + 1});
        }

        for(let i = 0; i < players.length - 1; i++) {
            deck.push({...allCards["explosive"], id: deck.length + 1});
        }

        shuffleArray(deck);
        
        return {
            cardsRemaining: deck,
            discardPile: [],
            playerTurn: gamePlayers[0].username,
            players: gamePlayers
        }
    },
    sanitizeGameState: (gameState: GameState | null): SanitizedGameState | null => {
        if (!gameState) {
            return null;
        }

        return {
            ...gameState,
            cardsRemaining: gameState.cardsRemaining.length,
            players: gameState.players.map(player => ({...player, cards: player.cards.length}))
        }
    }, 
    drawCard: (gameState: GameState, username: string): GameState | null => {
        if (gameState.playerTurn !== username) {
            return null;
        }

        const player = gameState.players.find(p => p.username === username);
        if (!player) {
            return null;
        }
        
        const card = gameState.cardsRemaining.pop();
        if (card === undefined) {
            return null;
        }

        player.cards.push(card);

        return advanceToNextPlayer(gameState);
    },
    playCard: (gameState: GameState, username: string, card: Card): GameState | null => {
        if (gameState.playerTurn !== username) {
            return null;
        }
        
        const player = gameState.players.find(p => p.username === username);
        if (!player) {
            return null;
        }
       
        const cardInHand = player.cards.find(c => c.id === card.id && c.type === card.type);
        if (!cardInHand) {
            return null;
        }

        player.cards = player.cards.filter(c => c.id !== cardInHand.id);
        gameState.discardPile.push(cardInHand);

        switch (cardInHand.type) {
            case "shuffle": 
                shuffleArray(gameState.cardsRemaining);
                break;
            case "skip": 
                return advanceToNextPlayer(gameState);
        }
        
        return gameState;
    }
}

export default game;