const amqplib = require("amqplib");
const logger = require("../utils/logger");

const queueManager = async (req, res) => {
  const { userId } = req.user;
  const { task } = req.body;

  try {
    const connection = await amqplib.connect(process.env.RABBITMQ_URI);
    const channel = await connection.createChannel();

    const queueName = `queue_${userId}`;
    await channel.assertQueue(queueName, { durable: true });

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify({ task })));
    logger.info(`Task queued for user ${userId}: ${task}`);

    res.status(200).json({ message: "Task queued successfully" });
  } catch (err) {
    logger.error("Queueing error", err);
    res.status(500).json({ message: "Queueing failed" });
  }
};

module.exports = { queueManager };
