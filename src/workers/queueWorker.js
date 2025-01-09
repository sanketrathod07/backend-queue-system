const amqp = require('amqplib');
require('dotenv').config();

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URI);
        const channel = await connection.createChannel();
        const queueName = 'client1';

        await channel.assertQueue(queueName, { durable: true });
        console.log(`Worker listening on queue "${queueName}"`);

        channel.consume(queueName, (message) => {
            if (message) {
                const content = message.content.toString();
                console.log(`Received message: ${content}`);
                setTimeout(() => {
                    console.log(`Processed message: ${content}`);
                    channel.ack(message);
                }, 1000);
            }
        });
    } catch (error) {
        console.error('Failed to connect RabbitMQ worker', error);
    }
};

connectRabbitMQ();
