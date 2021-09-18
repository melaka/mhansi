const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const BadWords = require("bad-words");

const messages = require("./utils/messages.js");
const users = require("./utils/users.js");

const app = express();
const server = http.createServer(app);
const io  = socketio(server);

const port = process.env.PORT || 3000;

// Setup public route
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

io.on("connection", (socket) => {
     socket.on("join", (query, callback) => {

          const user = users.addUser({
               id: socket.id,
               username: query.username,
               room: query.room
          });

          if(user.error){
               return callback(user.error);
          }

          socket.join(user.room);
          socket.emit("message", messages.generateMessage("System", "Welcome to the chat app"));
          socket.broadcast.to(user.room).emit("message", messages.generateMessage("System",user.username + " has joined!"));
          
          io.to(user.room).emit("roomData", {
               room: user.room,
               users: users.getUsersInRoom(user.room)
          });
          
          callback();
     })

     socket.on("sendMessage", (message, callback) => {
          const badWords = new BadWords();

          if(badWords.isProfane(message)){
               return callback("Please dont use bad words!")
          }

          const user = users.getUser(socket.id);

          io.to(user.room).emit("message", messages.generateMessage(user.username,message));
          callback();
     });

     socket.on("sendLocation", (location, callback) => {
          const user = users.getUser(socket.id);
          
          const url = `https://google.com/maps?q=${location.latitude},${location.longitude}`;
          io.to(user.room).emit("locationMessage", messages.generateLocationMsg(user.username, url));
          callback();
     });

     socket.on("disconnect", () => {
          const user = users.removeUser(socket.id);

          if(user){
               io.to(user.room).emit("message", messages.generateMessage(user.username + " has left!"));

               io.to(user.room).emit("roomData", {
                    room: user.room,
                    users: users.getUsersInRoom(user.room)
               });
          }
     })
});
 
server.listen(port, () => {
    console.log("Server running on " + port);
});
