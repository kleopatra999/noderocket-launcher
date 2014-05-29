// use express and listen for new websocket connections
// turn off the websocket debug messages
var express = require('express');
var Launcher = require('./launcher');
var app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server, { log:false });

var myLauncher = {};
//var myLauncher = new Launcher();

app.use(express.static('www'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/exec/:op/:valve', function(req, res) {
  if (req.params.op === 'open') {
    if (req.params.valve === 'fill') {
      openFill(myLauncher);
    }
    else {
      openLaunch(myLauncher);
    }
  }
  else {
    if (req.params.valve === 'fill') {
      closeFill(myLauncher);
    }
    else {
      closeLaunch(myLauncher);
    }
  }
  res.send(200, { message: 'Success!' });
});

server.listen(8082);

// function to link up launcher to websocket
var linkSocket = function(socket, launcher) {
  // Emit launcher ready
  launcher.on('launcher-ready', function(data) {
    socket.emit('ready', data);
  });

  // Emit launcher data
  launcher.on('launcher-data', function(data) {
    socket.emit('data', data);
  });

  // Emit launch valve data
  launcher.on('launchValve', function(data) {
    socket.emit('launchValve', data);
  });

  // Emit fill valve data
  launcher.on('fillValve', function(data) {
    socket.emit('fillValve', data);
  });

  // open and close valves
  socket.on('openFill', function() {
    openFill(launcher);
  });

  socket.on('closeFill', function() {
    closeFill(launcher);
  });

  socket.on('openLaunch', function() {
    openLaunch(launcher);
  });

  socket.on('closeLaunch', function() {
    closeLaunch(launcher);
  });

  socket.on('reset', function() {
    launcher.reset();
  });
};

// Connect up the socket on connection
io.sockets.on('connection', function(socket) {
  socket.emit('hello');
  linkSocket(socket, myLauncher);
});

function openLaunch(launcher) {
  console.log('Opening launch valve...');
  launcher.openLaunch();
}

function closeLaunch(launcher) {
  console.log('Opening launch valve...');
  launcher.closeLaunch();
}

function openFill(launcher) {
  console.log('Opening fill valve...');
  launcher.openFill();
}

function closeFill(launcher) {
  console.log('Closing closing valve...');
  launcher.closeFill();
}
