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
var game = {
    init: function (players) {
        var deck = [];
        basicGame.cards.forEach(function (cardQuantity) {
            for (var i = 0; i < cardQuantity.number; i++) {
                deck.push(__assign({}, cardQuantity.card));
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
            deck.push(__assign({}, allCards["defuse"]));
        }
        for (var i = 0; i < players.length - 1; i++) {
            deck.push(__assign({}, allCards["explosive"]));
        }
        shuffleArray(deck);
        return {
            cardsRemaining: deck,
            discardPile: [],
            playerTurn: gamePlayers[0].username,
            players: gamePlayers
        };
    },
    sanitizeGameState: function (gameState) {
        if (!gameState) {
            return null;
        }
        return __assign(__assign({}, gameState), { cardsRemaining: gameState.cardsRemaining.length, players: gameState.players.map(function (player) { return (__assign(__assign({}, player), { cards: player.cards.length })); }) });
    },
    drawCard: function (gameState, username) {
        console.log(gameState.playerTurn);
        console.log(username);
        if (gameState.playerTurn !== username) {
            return null;
        }
        console.log(gameState.cardsRemaining);
        var card = gameState.cardsRemaining.pop();
        if (card === undefined) {
            return null;
        }
        var currentPlayerIndex = gameState.players.findIndex(function (player) { return player.username === username; });
        if (currentPlayerIndex < 0) {
            return null;
        }
        gameState.players[currentPlayerIndex].cards.push(card);
        gameState.playerTurn = currentPlayerIndex + 1 > gameState.players.length - 1
            ? gameState.players[0].username
            : gameState.players[currentPlayerIndex + 1].username;
        return gameState;
    }
};
exports.default = game;
