const express = require('express');
const { connectRabbitMQ, createQueue, sendMessageToQueue } = require('./utils/rabbitmq');
const authenticate = require('./middlewares/auth');
const connectDB = require('./config/db');
const authRoutes = require('./middlewares/auth')

require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;


connectDB();
app.use(express.json());

app.use('/auth', authRoutes);




(async () => {
    const { channel } = await connectRabbitMQ();

    const queueName = 'client1';
    await channel.assertQueue(queueName, { durable: true });

    console.log(`Queue "${queueName}" is ready.`);

    channel.sendToQueue(queueName, Buffer.from('Hello RabbitMQ From Sanket!'));
    console.log('Message sent to queue.');
})();




// Test API to send a message to the queue (But only for authenticated usersm :)
app.post('/send', authenticate, async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message required' });
    }

    try {
        await sendMessageToQueue('person1', message);
        res.status(200).json({ success: true, message: 'Message sent to queue' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
