import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'mahashri_admin_session';

const SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN || 'change-me-admin-session-token';

export function isValidAdminCredentials(username, password) {
  const configuredUsername = process.env.ADMIN_USERNAME || 'admin';
  const configuredPassword = process.env.ADMIN_PASSWORD || 'admin123';
  return username === configuredUsername && password === configuredPassword;
}

export async function setAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, SESSION_TOKEN, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === SESSION_TOKEN;
}
