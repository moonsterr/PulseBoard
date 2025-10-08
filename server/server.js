import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import canvasRoutes from './routes/canvasRoutes.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import './services/googleService.js';
import { initSockets } from './sockets/index.js';
import { connectConsumer } from './consumer/kafka.js';
import { connectProducer } from './producer/kafka.js';
import startConsumers from './consumer/index.js';

const app = express();
dotenv.config();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
app.use(passport.initialize());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', userRoutes);
app.use('/api', canvasRoutes);

const server = http.createServer(app);
initSockets(server);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listing on http://localhost:3000');
});

// import createElementsTopic from './test.js';
// createElementsTopic();

(async function run() {
  const { Kafka } = await import('kafkajs');
  const { kafkaConfig } = await import('./config/kafkaConfig.js');
  const kafka = new Kafka(kafkaConfig);
  const admin = kafka.admin();

  await admin.connect();

  let retries = 20;
  for (let i = 0; i < retries; i++) {
    const topics = await admin.listTopics();
    if (topics.includes('__consumer_offsets')) {
      console.log('Kafka internal topics ready');
      break;
    }
    console.log(`Waiting for internal topics... (${i + 1}/${retries})`);
    await new Promise((res) => setTimeout(res, 5000));
  }

  const existingTopics = await admin.listTopics();
  if (!existingTopics.includes('elements-topic')) {
    await admin.createTopics({
      topics: [
        { topic: 'elements-topic', numPartitions: 1, replicationFactor: 1 },
      ],
      waitForLeaders: true,
    });
    console.log('✅ Created topic "elements-topic"');
  }

  await admin.disconnect();

  const { connectProducer } = await import('./producer/kafka.js');
  const { connectConsumer } = await import('./consumer/kafka.js');
  const startConsumers = (await import('./consumer/index.js')).default;

  await connectProducer();
  await connectConsumer();
  await startConsumers();
})();
