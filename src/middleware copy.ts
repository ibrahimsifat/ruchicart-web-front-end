import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const locales = ["en", "bn"] as const;
const defaultLocale = "en";

type Locale = (typeof locales)[number];

function getLocale(request: NextRequest): Locale {
  // Check in cookie first
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url
      )
    );
  }

  // Authentication check
  const token = request.cookies.get("auth-token")?.value;
  console.log(token);
  const isAuthPage = pathname.includes("/auth");

  if (!token && !isAuthPage) {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
  }

  if (token && isAuthPage) {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    // Skip all API routes
    // Skip all static files
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    // Match root path
    "/",
  ],
};
