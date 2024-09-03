const express = require('express');
const app = express();
const pageRoute = require('./routes/pageRoute');
const path = require('path');
const socketio = require('socket.io');
const moment = require('moment');

require('dotenv').config();

app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')))

app.use('/', pageRoute);

const server = app.listen(process.env.PORT || 3000, () =>{
    console.log('Listening PORT ', process.env.PORT);
})

const io = socketio(server);

var users = [];

io.on('connection', (socket) =>{ 
    socket.on('join-room', (data) =>{
    var findUser = users.findIndex(item => item.nickname === data.nickname); // Returns -1 if the user does not exist
    if(findUser !== -1){
        socket.emit('user-exists');
    }else{
        users.push({
            id: socket.id,
            nickname: data.nickname,
            room: data.room
            });
        socket.join(data.room);
        io.to(data.room).emit('join-message', data.room, `${data.nickname} has joined the chat.`, moment().format('hh:mm'));
    }
    })

    socket.on('chat-message', (nickname, message) =>{
        var findSender = users.find(item => item.id  === socket.id);
        io.to(findSender.room).emit('send-message', findSender.nickname, message, moment().format('hh:mm'));
       
    })

    socket.on('disconnect', () =>{
        var findLeftUser = users.findIndex(item => item.id === socket.id);
        if(findLeftUser !== -1){
            io.to(users[findLeftUser].room).emit('left-message', `${users[findLeftUser].nickname} has left in the chat.`, moment().format('hh:mm'));
            users.splice(findLeftUser, 1);
        }
    })
})




