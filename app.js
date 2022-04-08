const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const { addUser, getUser, removeUser, getTime, getAllUsers } = require('./util')

const port = 3000
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const manager = 'Server'

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (socket) => {
  socket.on('setUser', (data) => {
    const user = addUser(socket.id, data.username, data.room)
    socket.data.username = user.username
    socket.join(user.room)

    io.to(user.room).emit('participants', {
      participants: getAllUsers(user.room),
    })

    socket.emit('notify', {
      message: `Welcome to the room, ${user.username}.`,
      time: getTime(),
      user: manager,
    })

    socket.broadcast.to(user.room).emit('notify', {
      message: `${user.username} joined.`,
      time: getTime(),
      user: manager,
    })
  })

  socket.on('serveMessage', (message) => {
    user = getUser(socket.id)
    io.to(user.room).emit('message', {
      message: message,
      time: getTime(),
      user: user.username,
    })
  })

  socket.on('disconnect', () => {
    user = getUser(socket.id)
    if (user) {
      io.to(user.room).emit('notify', {
        message: `${socket.data.username} left the chat.`,
        time: getTime(),
        user: manager,
      })
      removeUser(socket.id)
      io.to(user.room).emit('participants', {
        participants: getAllUsers(user.room),
      })
    }
  })
})

server.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})

/**
 * socket.emit : To emit to the socket received
 * io.emit : To emit to all the clients
 * socket.broadcast.emit : To emit to all clients except socket received
 */
