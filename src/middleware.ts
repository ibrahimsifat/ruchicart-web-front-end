import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { useAuthStore } from "./store/auth-store";
const intlMiddleware = createMiddleware(routing);
export default function middleware(req: NextRequest) {
  // const publicPages = ["/", "/auth/login", "/auth/signup", "/auth/verify-otp"];
  const privatePages = ["/profile", "/checkout"];

  const authToken = useAuthStore.getState().token;

  if (
    !authToken &&
    privatePages.some((page) => req.nextUrl.pathname.startsWith(page))
  ) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return intlMiddleware(req);
}
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
