import { Kafka } from 'kafkajs';
import { kafkaConfig } from '../config/kafkaConfig.js';

const kafka = new Kafka(kafkaConfig);

export const producer = kafka.producer();

export async function connectProducer() {
  await producer.connect();
  console.log('producer has been connected to');
}
