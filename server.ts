import express = require('express');
require('typescript-require');
import socketModule from './socket/socket';
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

socketModule.init(io);

app.get('/', function (req, res) {
  res.send('hello world')
})

const port = process.env.PORT ?? "4000"

server.listen(port, () => {
  console.log('Listening on ' + port);
});