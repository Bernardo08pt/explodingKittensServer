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
Object.defineProperty(exports, "__esModule", { value: true });
var allCards = {
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
};
var basicGameCards = [
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
];
var basicGame = {
    numberExplosives: 4,
    numberDefuses: 6,
    cards: basicGameCards
};
var shuffleArray = function (array) {
    var _a;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
    }
};
var advanceToNextPlayer = function (gameState) {
    var players = gameState.players, playerTurn = gameState.playerTurn;
    var nextPlayerPosition = players.findIndex(function (p) { return p.username === playerTurn; }) + 1;
    var lastPlayerPosition = players.length - 1;
    gameState.playerTurn = nextPlayerPosition > lastPlayerPosition
        ? players[0].username
        : players[nextPlayerPosition].username;
    return gameState;
};
var game = {
    init: function (players) {
        var deck = [];
        basicGame.cards.forEach(function (cardQuantity) {
            for (var i = 0; i < cardQuantity.number; i++) {
                deck.push(__assign(__assign({}, cardQuantity.card), { id: deck.length + 1 }));
            }
        });
        shuffleArray(deck);
        var gamePlayers = [];
        players.forEach(function (player) {
            var playerCards = [];
            for (var i = 0; i < 7; i++) {
                var card = deck.pop();
                if (card) {
                    playerCards.push(card);
                }
            }
            playerCards.push(__assign({}, allCards["defuse"]));
            gamePlayers.push({
                username: player,
                cards: playerCards,
                isAlive: true
            });
        });
        var numberDefusesInGame = players.length > 3
            ? basicGame.numberDefuses - players.length
            : 2;
        for (var i = 0; i < numberDefusesInGame; i++) {
            deck.push(__assign(__assign({}, allCards["defuse"]), { id: deck.length + 1 }));
        }
        for (var i = 0; i < players.length - 1; i++) {
            deck.push(__assign(__assign({}, allCards["explosive"]), { id: deck.length + 1 }));
        }
        shuffleArray(deck);
        return {
            cardsRemaining: deck,
            discardPile: [],
            playerTurn: gamePlayers[0].username,
            players: gamePlayers,
            numberOfTurns: 1
        };
    },
    sanitizeGameState: function (gameState) {
        if (!gameState) {
            return null;
        }
        return __assign(__assign({}, gameState), { cardsRemaining: gameState.cardsRemaining.length, players: gameState.players.map(function (player) { return (__assign(__assign({}, player), { cards: player.cards.length })); }) });
    },
    drawCard: function (gameState, username) {
        if (gameState.playerTurn !== username) {
            return null;
        }
        var player = gameState.players.find(function (p) { return p.username === username; });
        if (!player) {
            return null;
        }
        var card = gameState.cardsRemaining.pop();
        if (card === undefined) {
            return null;
        }
        player.cards.push(card);
        if (gameState.numberOfTurns === 1) {
            return advanceToNextPlayer(gameState);
        }
        gameState.numberOfTurns--;
        return gameState;
    },
    playCard: function (gameState, username, card) {
        if (gameState.playerTurn !== username) {
            return null;
        }
        var player = gameState.players.find(function (p) { return p.username === username; });
        if (!player) {
            return null;
        }
        var cardInHand = player.cards.find(function (c) { return c.id === card.id && c.type === card.type; });
        if (!cardInHand) {
            return null;
        }
        player.cards = player.cards.filter(function (c) { return c.id !== cardInHand.id; });
        gameState.discardPile.push(cardInHand);
        switch (cardInHand.type) {
            case "shuffle":
                shuffleArray(gameState.cardsRemaining);
                break;
            case "skip":
                return advanceToNextPlayer(gameState);
            case "attack":
                gameState.numberOfTurns++;
                return advanceToNextPlayer(gameState);
        }
        return gameState;
    },
    seeTheFuture: function (gameState) {
        var cardsRemaining = gameState.cardsRemaining;
        var cards = [];
        for (var i = cardsRemaining.length; i > cardsRemaining.length - 3; i--) {
            if (cardsRemaining[i - 1]) {
                cards.push(cardsRemaining[i - 1]);
            }
        }
        return cards;
    }
};
exports.default = game;
