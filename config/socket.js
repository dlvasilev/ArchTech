'use strict';

var socketio = require('socket.io'),
    messenger = require('../app/controllers/messenger'),
    io,
    currentRoom = {};

function joinRoom(socket, room) {
    socket.join(room);
    currentRoom[socket.id] = room;
}

function handleGroupJoining(socket) {
    socket.on('join', function(group) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, group.group);
    });
}

function handleMessageBroadcasting(socket) {
    socket.on('message', function (message) {
        socket.broadcast.to(message.group).emit('message', {
            text: message.user+': ' + message.text
        });
        console.log(message.user+': ' + message.text);
        messenger.saveMessage({
            content: message.text, 
            user: message.user, 
            userId: message.userId, 
            file: message.group
        });
    });
}

function handleChangesBroadcasting(socket) {
    socket.on('changes', function (change) {
        socket.broadcast.to(change.group).emit('changes', {
            data: change.data
        });
    });
}


function handleClientDisconnection(socket) {
    socket.on('disconnect', function() {

    });
}

exports.listen = function(server) {
    io = socketio.listen(server);
    io.set('log level', 1);
    io.sockets.on('connection', function(socket) {
        joinRoom(socket, 'Home');
        handleMessageBroadcasting(socket);
        handleChangesBroadcasting(socket);
        handleGroupJoining(socket);
        handleClientDisconnection(socket);
    });
};
