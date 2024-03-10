const io = require('socket.io')(8080,{
    cors: {
        origin: "http://localhost:3000",
    }
});

// Socket.io connection event
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for new messages from clients
  socket.on('new-message', (message) => {
    // Broadcast the message to all connected clients, including the sender
    io.emit('broadcast-message', { text: message, sender: 'user' });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
