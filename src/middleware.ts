import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(request) {
    const pathname = request.nextUrl.pathname;
    const token = request.nextauth.token;
    const account_type = token?.accountType as string;

    // Prevent unauthorized users from accessing the dashboard
    if (!token && pathname.match(/dashboard/)) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // Prevent CLIENT account types from accessing TALENT pages
    if (
      token &&
      account_type == "CLIENT" &&
      pathname.match(/\/dashboard\/talent/)
    ) {
      return NextResponse.redirect(
        new URL(`/dashboard/${account_type.toLowerCase()}`, request.url)
      );
    }

    // Prevent TALENT account types from accessing CLIENT pages
    if (
      token &&
      account_type == "TALENT" &&
      pathname.match(/\/dashboard\/client/)
    ) {
      return NextResponse.redirect(
        new URL(`/dashboard/${account_type.toLowerCase()}`, request.url)
      );
    }

    // Prevent authorized users from accessing the login page
    if (token && pathname.match(/signin/)) {
      return NextResponse.redirect(
        new URL(`/dashboard/${account_type.toLowerCase()}`, request.url)
      );
    }
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/signin"],
};
