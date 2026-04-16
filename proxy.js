import { NextResponse } from 'next/server';

const ADMIN_COOKIE_NAME = 'mahashri_admin_session';
const SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN || 'change-me-admin-session-token';

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith('/admin');
  const isAdminLogin = pathname === '/admin/login';
  const isAdminApi = pathname.startsWith('/api/admin') && pathname !== '/api/admin/login';

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  if (isAdminLogin) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (token === SESSION_TOKEN) {
    return NextResponse.next();
  }

  if (isAdminApi) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const loginUrl = new URL('/admin/login', request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
