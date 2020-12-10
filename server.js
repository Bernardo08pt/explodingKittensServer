"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
require('typescript-require');
var socket_1 = __importDefault(require("./socket/socket"));
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
socket_1.default.init(io);
app.get('/', function (req, res) {
    res.send('hello world');
});
var port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : "4000";
server.listen(port, function () {
    console.log('Listening on ' + port);
});
