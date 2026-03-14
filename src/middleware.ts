import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-default-jwt-secret-key-change-it'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // Protect Dashboard and API routes (except auth)
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                          (pathname.startsWith('/api') && !pathname.startsWith('/api/auth'));

  if (isProtectedRoute) {
    if (!token) {
      if (pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      const response = pathname.startsWith('/api') 
        ? NextResponse.json({ error: 'Auth session expired' }, { status: 401 })
        : NextResponse.redirect(new URL('/login', request.url));
      
      response.cookies.delete('auth-token');
      return response;
    }
  }

  // Redirect away from login/register if already authenticated
  if ((pathname === '/login' || pathname === '/register') && token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      // Token invalid, allow login page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*', '/login', '/register'],
};
