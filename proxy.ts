import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  // Disable auth-based redirects in middleware because backend cookies are on a different origin
  // and are not available to Next.js middleware. Client-side auth handling will manage redirects.
  return NextResponse.next();
}

export const config = {
  // No matchers while middleware auth redirects are disabled
  matcher: [],
};
