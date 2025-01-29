import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const hasSession = request.cookies.has('session_id');
  const isSessionPage = request.nextUrl.pathname === '/session';

  // If we're on the session page and have a session, redirect to home
  if (isSessionPage && hasSession) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow access to session page, API routes and static files
  if (
    isSessionPage ||
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/static/')
  ) {
    return response;
  }

  // Redirect to session creation if no session exists
  if (!hasSession) {
    return NextResponse.redirect(new URL('/session', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon.ico).*)',
  ],
};
