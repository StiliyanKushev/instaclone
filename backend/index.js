const socketio = require('socket.io');
const { addUser, removeUser, getUser } = require('./users');

let env = process.env.NODE_ENV || 'development'

let settings = require('./config/settings')[env]

const app = require('express')()
var http = require('http').createServer(app);
const io = socketio(http);

io.on('connect', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
      console.log(name,room);
      const { error, user } = addUser({ id: socket.id, name, room });
  
      if(error) return callback(error);
  
      socket.join(user.room);

      callback();
    });

    socket.on('exit', ({ room }, callback) => {
      try {
        if(room !== 'any'){
          socket.leave(room);
        }
        else{
          socket.leaveAll();
        }
        removeUser(socket.id);
      } catch {
        callback("Could not leave the room you were not in.")
      }

      callback();
    });
  
    socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id);

<<<<<<< HEAD
      if(!user){
=======
      console.log(user);

      if(!user){
        console.log(socket.id);
>>>>>>> master
        return callback("User not found");
      }
  
      io.to(user.room).emit('message', { user: user.name, text: message });
  
      callback();
    });
  
    socket.on('disconnect', () => {
        removeUser(socket.id);
    })
  });

require('./config/database')(settings)
require('./config/express')(app)
require('./config/routes')(app)
require('./config/passport')()

http.listen(settings.port)
console.log(`Server listening on port ${settings.port}...`)
