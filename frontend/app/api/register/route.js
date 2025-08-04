import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, full_name, password } = body;

    // Check for existing user
    const existingUser = await prisma.profile.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.profile.create({
      data: {
        id: crypto.randomUUID(),
        email,
        full_name,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = await new SignJWT({ userId: newUser.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key'));

    const response = NextResponse.json(
      { success: true, user: { id: newUser.id, email: newUser.email, full_name: newUser.full_name } },
      { status: 201 }
    );

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (err) {
    console.error('❌ Registration Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
