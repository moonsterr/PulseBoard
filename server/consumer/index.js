import { consumerA } from './kafka.js';
import { saveElement, updateElement } from '../services/canvasService.js';
export default async function startConsumers() {
  await consumerA.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const payload = JSON.parse(message.value.toString());
        const { element, canvasId, eventType } = payload;

        if (eventType === 'element:new') {
          await saveElement(element, canvasId);
          console.log(`Element saved: ${element._id}`);
        } else if (eventType === 'element:update') {
          await updateElement(element, canvasId);
          console.log(`Element updated: ${element._id}`);
        }
      } catch (err) {
        console.error('Error processing Kafka message:', err);
      }
    },
  });
}
