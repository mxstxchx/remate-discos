import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const hasSession = request.cookies.has('session_id');

  // Allow access to session creation endpoint and static files
  if (
    request.nextUrl.pathname.startsWith('/api/session') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/static')
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
  matcher: ['/((?!api/session|_next/static|favicon.ico).*)'],
};
