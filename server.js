var express = require('express');
var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

var Launcher = require('./launcher/launcher');
//var Launcher = require('./launcher/spark-launcher');

app.use(express.static('www'));

server.listen(8082);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var launcher;


// Socket IO configuration
io.sockets.on('connection', function (socket) {
  socket.emit('hello');

  socket.on('start', function(data) {
    console.log(data);

    // Initialize launcher if not already
    if(!launcher) {
      launcher = new Launcher(data);
    }

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
  });

  socket.on('openFill', function(){
    console.log('openFill');
    launcher.openFill()
  });

  socket.on('closeFill', function(){
    console.log('closeFill');
    launcher.closeFill()
  });

  socket.on('openLaunch', function(){
    console.log('openLaunch');
    launcher.openLaunch()
  });

  socket.on('closeLaunch', function(){
    console.log('closeLaunch');
    launcher.closeLaunch()
  });

  socket.on('fillAndLaunch', function(psi) {
    console.log('fillAndLaunch');
    launcher.fillTo(psi, true);
  });

  socket.on('fillTo', function(psi){
    console.log('fill to ' + psi );
    launcher.fillTo(psi);
  });

  socket.on('fill', function(){
    console.log('fill');
    launcher.fill()
  });

  socket.on('launch', function() {
    console.log('launch');
    launcher.launch();
  });

  socket.on('reset', function() {
    launcher.reset();
  })
});


