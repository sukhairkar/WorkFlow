// GET /api/messages/[roomId]
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_, { params }) {
  const { roomId } = params;

  try {
    const messages = await prisma.message.findMany({
     where: { roomId },
     include: { sender: true },
     orderBy: { createdAt: 'asc' }
    });


    return NextResponse.json(messages);
  } catch (err) {
    console.error('Failed to fetch messages:', err);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
