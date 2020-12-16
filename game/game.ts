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

const game = {
    init: (players: Array<string>): GameState => {
        const deck: Array<Card> = [];  
        
        basicGame.cards.forEach(cardQuantity => {
            for(let i = 0; i < cardQuantity.number; i++) {
                deck.push({...cardQuantity.card});
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
            deck.push({...allCards["defuse"]});
        }

        for(let i = 0; i < players.length - 1; i++) {
            deck.push({...allCards["explosive"]});
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
        
        const card = gameState.cardsRemaining.pop();
        if (card === undefined) {
            return null;
        }

        const currentPlayerIndex = gameState.players.findIndex(player => player.username === username);
        if (currentPlayerIndex < 0) {
            return null
        }

        gameState.players[currentPlayerIndex].cards.push(card); 
        gameState.playerTurn = currentPlayerIndex + 1 > gameState.players.length - 1
            ? gameState.players[0].username 
            : gameState.players[currentPlayerIndex+1].username;

        return gameState;
    },
    playCard: (gameState: GameState, username: string, card: Card): GameState | null => {
        if (gameState.playerTurn !== username) {
            return null;
        }
        
        const currentPlayerIndex = gameState.players.findIndex(player => player.username === username);
        if (currentPlayerIndex < 0) {
            return null
        }

        const cardIndex = gameState.players[currentPlayerIndex].cards.findIndex(c => c.type === card.type);
        if (cardIndex < 0) {
            return null;
        }

        gameState.players[currentPlayerIndex].cards = gameState.players[currentPlayerIndex].cards.filter((c, index) => index !== cardIndex);
        gameState.discardPile.push(card);

        return gameState;
    }
}

export default game;