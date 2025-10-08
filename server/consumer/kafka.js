import { Kafka } from 'kafkajs';
import { kafkaConfig } from '../config/kafkaConfig.js';

const kafka = new Kafka(kafkaConfig);

export const consumerA = kafka.consumer({ groupId: 'elements-group' });

export async function connectConsumer() {
  await consumerA.connect();
  console.log('we have connected to consumer A');
  await consumerA.subscribe({ topic: 'elements-topic', fromBeginning: false });
  console.log('we have subbed to A');
}
