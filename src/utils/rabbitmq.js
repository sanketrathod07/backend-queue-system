const amqp = require('amqplib');

let connection, channel;

const connectRabbitMQ = async () => {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URI);
        channel = await connection.createChannel();
        console.log('RabbitMQ connected');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ', error);
    }
};

const createQueue = async (queueName) => {
    try {
        await channel.assertQueue(queueName, { durable: true });
        console.log(`Queue "${queueName}" created`);
    } catch (error) {
        console.error(`Failed to create queue "${queueName}"`, error);
    }
};

const sendMessageToQueue = async (queueName, message) => {
    try {
        channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
        console.log(`Message sent to queue "${queueName}": ${message}`);
    } catch (error) {
        console.error(`Failed to send message to queue "${queueName}"`, error);
    }
};

const closeRabbitMQ = async () => {
    try {
        await channel.close();
        await connection.close();
        console.log('RabbitMQ connection closed');
    } catch (error) {
        console.error('Failed to close RabbitMQ connection', error);
    }
};

module.exports = {
    connectRabbitMQ,
    createQueue,
    sendMessageToQueue,
    closeRabbitMQ,
};
