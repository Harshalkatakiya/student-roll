import { COOKIE_NAME } from '@/utils/constants/app.constant';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest): NextResponse | undefined {
  const isPublicPath = {
    '/login': true,
    '/signup': true,
    '/forgot-password': true,
    '/update-password': true
  }[request.nextUrl.pathname];
  const cookie = request.cookies.get(COOKIE_NAME);
  const token = cookie?.value;
  return (
    isPublicPath && token ? NextResponse.redirect(new URL('/', request.nextUrl))
    : !isPublicPath && !token ?
      NextResponse.redirect(new URL('/login', request.nextUrl))
    : undefined
  );
}
export const config = {
  matcher: ['/', '/profile']
};
