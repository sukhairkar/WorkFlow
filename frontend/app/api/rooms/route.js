// POST /api/rooms
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { name, creatorId } = await req.json();

    const room = await prisma.chatRoom.create({
      data: {
        name,
        creatorId,
      },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (err) {
    console.error("Room creation error:", err);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}
