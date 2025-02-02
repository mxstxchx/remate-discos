import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  // Skip public assets and api routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/session')
  ) {
    return NextResponse.next();
  }

  const sessionId = request.cookies.get('session-id')?.value;

  if (!sessionId) {
    return NextResponse.redirect(new URL('/session', request.url));
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: session } = await supabase
      .from('user_sessions')
      .select('expires_at')
      .eq('id', sessionId)
      .single();

    if (!session || new Date(session.expires_at) < new Date()) {
      return NextResponse.redirect(new URL('/session', request.url));
    }

  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/session', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};