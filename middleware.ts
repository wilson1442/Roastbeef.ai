import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isEmailVerified = token?.emailVerified === true;
    const isOnRoastPage = req.nextUrl.pathname.startsWith('/roast');
    const isOnDashboardPage = req.nextUrl.pathname.startsWith('/dashboard');

    // Protect /roast route - requires auth and email verification
    if (isOnRoastPage && (!isAuth || !isEmailVerified)) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Protect /dashboard route - requires auth
    if (isOnDashboardPage && !isAuth) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/roast/:path*', '/dashboard/:path*'],
};
