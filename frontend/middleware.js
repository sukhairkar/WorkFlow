import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Add any routes that should be accessible without authentication
const publicPaths = [
  '/login',
  '/register',
  '/api/login',
  '/api/register',
  '/api/logout',
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow access to public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for token
  const token = request.cookies.get('token');

  // If no token and trying to access protected route, redirect to login
  if (!token) {
    if (request.headers.get('accept')?.includes('application/json')) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify token
    await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
    );
    return NextResponse.next();
  } catch (error) {
    // If token is invalid, clear it and redirect to login
    if (request.headers.get('accept')?.includes('application/json')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/socket (socket.io endpoint)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/socket|_next/static|_next/image|favicon.ico).*)'
  ]
};