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
var game = {
    init: function (players) {
        var deck = Array(56).fill({ name: "teste", effect: "teste" });
        var gamePlayers = [];
        players.forEach(function (player) {
            var playerCards = [];
            for (var i = 0; i < 7; i++) {
                var card = deck.pop();
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
        };
    },
    sanitizeGameState: function (gameState) {
        if (!gameState) {
            return null;
        }
        return __assign(__assign({}, gameState), { cardsRemaining: gameState.cardsRemaining.length, players: gameState.players.map(function (player) { return (__assign(__assign({}, player), { cards: player.cards.length })); }) });
    }
};
exports.default = game;
