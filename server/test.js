import { Kafka } from 'kafkajs';
import { kafkaConfig } from './config/kafkaConfig.js';

const kafka = new Kafka(kafkaConfig);
const admin = kafka.admin();

export default async function createElementsTopic() {
  try {
    console.log('⏳ Connecting to Kafka...');
    await admin.connect();

    console.log('🔧 Creating topic "elements-topic"...');
    await admin.createTopics({
      topics: [
        {
          topic: 'elements-topic',
          numPartitions: 1, // You can increase this later if needed
          replicationFactor: 1, // Must be 1 since you have one broker
        },
      ],
      waitForLeaders: true,
    });

    console.log('✅ Topic "elements-topic" created successfully.');
  } catch (err) {
    console.error('❌ Error creating topic:', err);
  } finally {
    await admin.disconnect();
    console.log('🔌 Disconnected from Kafka.');
  }
}

createElementsTopic();
