const { createServer } = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  socket.on('join', ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    socket.to(roomId).emit('user-joined', socket.id);
  });

  socket.on('message', async (data) => {
    console.log('Message received:', data);
    try {
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(data.senderId) || !uuidRegex.test(data.roomId)) {
        throw new Error('Invalid UUID format');
      }

      const savedMessage = await prisma.message.create({
        data: {
          content: data.content,
          userId: data.senderId,
          roomId: data.roomId
        },
        include: {
          sender: {
            select: {
              id: true,
              full_name: true
            }
          }
        }
      });
      io.to(data.roomId).emit('message', savedMessage);
    } catch (error) {
      console.error('Failed to save message:', error);
      socket.emit('error', { 
        message: error.message === 'Invalid UUID format' 
          ? 'Invalid user or room ID' 
          : 'Failed to save message' 
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running at http://localhost:${PORT}`);
});