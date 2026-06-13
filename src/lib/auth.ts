import { cookies } from 'next/headers';

const SESSION_COOKIE = 'admin_session';
const SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 hours

export async function isAdminLoggedIn(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE);
    if (!session?.value) return false;

    const decoded = Buffer.from(session.value, 'base64').toString();
    const parts = decoded.split(':');
    if (parts.length !== 3 || parts[0] !== 'admin') return false;

    const timestamp = parseInt(parts[1], 10);
    if (Date.now() - timestamp > SESSION_DURATION) return false;

    return true;
  } catch {
    return false;
  }
}

export async function createSessionToken(username: string, password: string): Promise<string | null> {
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin';

  if (username !== adminUser || password !== adminPass) return null;

  const timestamp = Date.now();
  const data = `admin:${timestamp}:${crypto.randomUUID()}`;
  return Buffer.from(data).toString('base64');
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}
