import pool from '../config/db.js'; // adjust the path to your Postgres pool
import { producer } from '../producer/kafka.js';
import { saveElement, updateElement } from '../services/canvasService.js';
import { sendToKafka } from '../services/kafkaService.js';
export default (io, socket) => {
  console.log('Board socket connected:', socket.id);

  // Socket events
  socket.on('element:new', async ({ element, canvasId }) => {
    socket.broadcast.emit('element:new', { id: element._id, element });
    await sendToKafka('element:new', element, canvasId);
  });

  socket.on('element:update', async ({ element, canvasId }) => {
    socket.broadcast.emit('element:update', { id: element._id, element });
    await sendToKafka('element:update', element, canvasId);
  });

  socket.on('disconnect', () => {
    console.log('Board socket disconnected:', socket.id);
  });
};
