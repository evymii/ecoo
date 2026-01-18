import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Admin routes protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // This is handled client-side in the admin pages
    // Server-side check would require cookies/tokens
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
