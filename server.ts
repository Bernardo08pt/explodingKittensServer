import app = require('express');
require('typescript-require');
const http = require('http').Server(app);
const io = require('socket.io')(http);
import socketModule from './socket/socket';

socketModule.init(io);

http.listen(4000, () => {
  console.log('Listening: http://localhost:4000');
});