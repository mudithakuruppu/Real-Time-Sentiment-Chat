const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io'); // dependencies
const http = require('http');
const Sentiment = require('sentiment');

//express app
const app = express();
app.use(cors());

//http and websocket server create
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8000", 
    methods: ["GET", "POST"]
  }
});

//create object for initializ to sentiment analys
const sentiment = new Sentiment();

//handling websocket
io.on('connection', (socket) => {
  console.log('✅ User connected');

  //icomming messg
  socket.on('message', (message) => {
    
    const result = sentiment.analyze(message.text);
    const normalizedScore = result.score / 5; 

    io.emit('message', {
      user: message.user || 'Anonymous',
      text: message.text,
      sentiment: normalizedScore,
      timestamp: new Date().toLocaleTimeString()
    });
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected');
  });
});

//server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});






