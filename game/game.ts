
const game = {
    init: (players: Array<string>): GameState => {
        const deck: Array<Card> = Array(56).fill({name: "teste", effect: "teste"});  
        
        let gamePlayers: Array<Player> = [];
        players.forEach(player => {
            let playerCards: Array<Card> = [];

            for (let i = 0; i < 7; i++) {
                const card = deck.pop();
                
                if (card) {
                    playerCards.push(card);
                }
            }
            
            gamePlayers.push({
                username: player,
                cards: playerCards,
                isAlive: true
            });
        });
        
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
    }
}

export default game;