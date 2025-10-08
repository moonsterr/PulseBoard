import { consumerA } from './kafka.js';
export default async function startConsumers() {
  await consumerA.run({
    eachMessage: async ({ message }) => {
      console.log(`Message recieved ${message}`);
    },
  });
}
