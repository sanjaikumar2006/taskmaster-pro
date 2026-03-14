import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-default-jwt-secret-key-change-it'
);

export async function createToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Safety check: ensure userId is a string (fixes potential serialization issues)
    if (payload && payload.userId && typeof payload.userId !== 'string') {
      try {
        // If it's a Mongoose object or Buffer-like object
        if (typeof payload.userId === 'object' && (payload.userId as any).buffer) {
          payload.userId = payload.userId.toString();
        } else {
          payload.userId = String(payload.userId);
        }
      } catch (e) {
        console.error('UserId sanitization failed:', e);
      }
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}

export async function setAuthCookie(payload: any) {
  const token = await createToken(payload);
  const cookieStore = await cookies();
  
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}
