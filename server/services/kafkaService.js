import { producer } from '../producer/kafka.js';

export const sendToKafka = async (eventType, element, canvasId) => {
  try {
    const messagePayload = {
      eventType,
      element,
      canvasId,
    };

    producer.send({
      topic: 'elements-topic',
      messages: [
        {
          key: element._id?.toString() || null, // optional: for partitioning
          value: JSON.stringify(messagePayload),
        },
      ],
    });
  } catch (err) {
    console.error('Error sending message to Kafka:', err);
  }
};
