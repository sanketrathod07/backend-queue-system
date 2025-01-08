const express = require('express');
const { connectRabbitMQ, createQueue, sendMessageToQueue } = require('./utils/rabbitmq');
const authenticate = require('./middlewares/auth');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./middlewares/auth')



const app = express();
const PORT = process.env.PORT || 5000;


connectDB();
app.use(express.json());

// Use the authentication routes (register and login)
app.use('/auth', authRoutes);


// Connect RabbitMQ
(async () => {
    try {
        await connectRabbitMQ();
        await createQueue('client1'); // Ensure the queue exists
        console.log('RabbitMQ connected');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ', error);
    }
})();




// Test API to send a message to the queue (only for authenticated users)
app.post('/send', authenticate, async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message content is required' });
    }

    try {
        await sendMessageToQueue('client1', message);
        res.status(200).json({ success: true, message: 'Message sent to queue' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
