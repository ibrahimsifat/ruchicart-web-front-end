import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { CONSTANT } from "./config/constants";
import { routing } from "./i18n/routing";

// Create middleware instance once
const intlMiddleware = createMiddleware(routing);

// Convert privatePages array to Set for O(1) lookup
const PRIVATE_PAGES_SET = new Set(CONSTANT.privatePages);

// Cache regex pattern
const LOCALE_REGEX = new RegExp(`^/(${CONSTANT.defaultLocale}|[a-z]{2})`);

export default function middleware(req: NextRequest) {
  // Early return for static files and API routes
  if (req.nextUrl.pathname.includes(".")) {
    return NextResponse.next();
  }

  const authToken = req.cookies.get("auth-token")?.value;
  const { pathname } = req.nextUrl;

  // Extract locale using regex test instead of split/replace
  const localeMatch = pathname.match(LOCALE_REGEX);
  const locale = localeMatch ? localeMatch[1] : CONSTANT.defaultLocale;
  const pathWithoutLocale = localeMatch
    ? pathname.slice(localeMatch[0].length)
    : pathname;

  // Check auth paths - direct startsWith check is faster than regex
  if (pathWithoutLocale.startsWith("/auth")) {
    if (authToken) {
      // Redirect authenticated users from auth pages
      return NextResponse.redirect(new URL(`/dashboard`, req.url));
    }
    // Let unauthenticated users access auth pages
    return intlMiddleware(req);
  }

  // Check private pages using Set for O(1) lookup
  if (!authToken) {
    for (const page of PRIVATE_PAGES_SET) {
      if (pathname.startsWith(page)) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }
  }

  return intlMiddleware(req);
}

// Optimize matcher pattern
export const config = {
  matcher: [
    // Skip all internal paths (_next) and static files
    "/((?!_next|api|.*\\..*).*)",
  ],
};
