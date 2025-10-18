import { sendToKafka } from '../services/kafkaService.js';
let i = 0;
export default (io, socket) => {
  console.log('Board socket connected:', socket.id);

  // Socket events
  socket.on('element:new', async ({ element, canvasId }) => {
    socket.broadcast.emit('element:new', { id: element._id, element });
    await sendToKafka('element:new', element, canvasId);
    i++;
    console.log('yes sent', i);
  });

  socket.on('element:update', async ({ element, canvasId }) => {
    socket.broadcast.emit('element:update', { id: element._id, element });
    await sendToKafka('element:update', element, canvasId);
    i++;
    console.log('yes sent', i);
  });
  socket.on('mouse:move', async (userData) => {
    console.log('this the user data', userData);
    socket.broadcast.emit('mouse:move', userData);
  });

  socket.on('disconnect', () => {
    console.log('Board socket disconnected:', socket.id);
  });
};
