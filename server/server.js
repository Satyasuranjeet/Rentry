const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "https://rentry-seven.vercel.app",
    methods: ["GET", "POST"]
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

// Listen on the specified port
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
