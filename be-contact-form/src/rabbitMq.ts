import amqp from "amqplib/callback_api";
let ch: amqp.Channel;
export let QUEUE_NAME = "technical";

const createRabbitMqConnection = (): Promise<amqp.Channel> =>
  new Promise((res, rej) => {
    if (ch) return res(ch);
    amqp.connect(`amqp://rabbitmq`, (err, connection) => {
      if (err) {
        throw err;
      }
      connection.createChannel((err, channel) => {
        if (err) {
          throw err;
        }

        // channel.sendToQueue(queueName, Buffer.from(message));
        ch = channel;
        return res(ch);
      });
    });
  });

const sendMessage = async (message: string, queueName = QUEUE_NAME) => {
  const channel = await createRabbitMqConnection();
  channel.assertQueue(queueName, {
    durable: false,
  });

  channel.sendToQueue(queueName, Buffer.from(message));
};

const consume = async (
  consumerTag: string,
  messageCallback: (message: Buffer, channel: amqp.Channel) => void,
  queueName = QUEUE_NAME
) => {
  const channel = await createRabbitMqConnection();

  return channel.consume(
    queueName,
    (message) => {
      if (!message) return;
      console.log("Received message: ", message.content.toString());
      messageCallback(message.content, channel);
      channel.ack(message);
    },
    { consumerTag }
  );
};

export { createRabbitMqConnection, sendMessage, consume };