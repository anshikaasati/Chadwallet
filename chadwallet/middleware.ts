// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Gate /trade/* routes
  if (pathname.startsWith("/trade")) {
    const privyToken = request.cookies.get("privy-token")?.value;

    if (!privyToken) {
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Decode and check JWT expiration to avoid importing server-auth SDK in edge runtime
      const parts = privyToken.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT token format");
      }

      // Base64URL decode the payload
      const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = atob(payloadBase64);
      const payload = JSON.parse(decodedPayload) as { exp?: number };

      if (payload.exp && payload.exp * 1000 < Date.now()) {
        throw new Error("Privy session token expired");
      }
    } catch (err) {
      console.error("Middleware auth validation failed:", err);
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/trade/:path*"],
};
