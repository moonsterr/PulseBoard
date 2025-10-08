import { Server } from 'socket.io';
import boardSocket from './boardSocket.js';

let io;

export const initSockets = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    boardSocket(io, socket);
  });
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
};
