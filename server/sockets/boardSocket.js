import pool from '../config/db.js'; // adjust the path to your Postgres pool
import { producer } from '../producer/kafka.js';
import { saveElement, updateElement } from '../services/canvasService.js';
import { sendToKafka } from '../services/kafkaService.js';
export default (io, socket) => {
  console.log('Board socket connected:', socket.id);

  // Socket events
  socket.on('element:new', async ({ element, canvasId }) => {
    console.log('socket websocket element bla bla recieved');
    socket.broadcast.emit('element:new', { id: element._id, element });
    const saved = await saveElement(element, canvasId);
    console.log('New element saved:', saved);
    await sendToKafka('element:new', element, canvasId);
  });

  socket.on('element:update', async ({ element, canvasId }) => {
    console.log('socket websocket element bla bla recieved');

    socket.broadcast.emit('element:update', { id: element._id, element });
    const updated = await updateElement(element, canvasId);
    console.log('Element updated:', updated);
    await sendToKafka('element:update', element, canvasId);
  });

  socket.on('disconnect', () => {
    console.log('Board socket disconnected:', socket.id);
  });
};
