import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login') &&
    !pathname.startsWith('/api/admin')
  ) {
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie?.value) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    try {
      const decoded = Buffer.from(sessionCookie.value, 'base64').toString();
      const parts = decoded.split(':');
      if (parts.length !== 3 || parts[0] !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      const timestamp = parseInt(parts[1], 10);
      if (Date.now() - timestamp > 4 * 60 * 60 * 1000) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
