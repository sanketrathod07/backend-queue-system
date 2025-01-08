const express = require('express');
const app = express();
const authenticate = require('./middleware/auth'); // Authentication middleware
const queueRoutes = require('./routes/queue');


// Connect to MongoDB


// Middleware and routes setup
app.use(express.json());



// Use the queue routes and protect them with authentication middleware
app.use('/queue', authenticate, queueRoutes);

// Example route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Protected route
app.get('/protected', authenticate, (req, res) => {
  res.send(`This is a protected route, Hello ${req.user.username}`);
});

module.exports = app;
