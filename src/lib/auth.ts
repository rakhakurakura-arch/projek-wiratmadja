import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is missing. Please set JWT_SECRET in your environment or .env file.');
  }
  return new TextEncoder().encode(secret);
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CONTRIBUTOR';
}

export async function createSession(user: UserSession) {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set('wiratmadja_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return token;
}

export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('wiratmadja_session')?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as UserSession;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('wiratmadja_session');
}
