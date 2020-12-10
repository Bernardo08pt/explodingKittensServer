"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("express");
require('typescript-require');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var socket_1 = __importDefault(require("./socket/socket"));
socket_1.default.init(io);
http.listen(process.env.PORT || 4000, function () {
    console.log('Listening');
});
