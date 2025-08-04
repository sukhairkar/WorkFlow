import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { name, userId } = await request.json();

    if (!name || !userId) {
      return NextResponse.json(
        { error: 'Name and userId are required' },
        { status: 400 }
      );
    }

    const chatRoom = await prisma.chatRoom.create({
      data: {
        name,
        createdById: userId
      }
    });

    return NextResponse.json(chatRoom);
  } catch (error) {
    console.error('Error creating chat room:', error);
    return NextResponse.json(
      { error: 'Failed to create chat room' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const chatRooms = await prisma.chatRoom.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            full_name: true
          }
        }
      }
    });

    return NextResponse.json(chatRooms);
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat rooms' },
      { status: 500 }
    );
  }
}