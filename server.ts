import app = require('express');
require('typescript-require');
const http = require('http').Server(app);
const io = require('socket.io')(http);
import socketModule from './socket/socket';

socketModule.init(io);

http.listen(process.env.PORT || 4000, () => {
  console.log('Listening' + process.env.PORT || 4000);
});