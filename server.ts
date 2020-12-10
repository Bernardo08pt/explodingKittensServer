import express = require('express');
require('typescript-require');
import socketModule from './socket/socket';
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

socketModule.init(io);

server.listen(process.env.PORT || 4000, () => {
  console.log('Listening' + process.env.PORT || 4000);
});