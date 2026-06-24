// lib/supabase/middleware.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * Session refresh helper stub.
 * Since ChadWallet uses Privy for Web3 authentication and session gating,
 * we handle Supabase operations server-side via the service role client.
 * This helper is provided as a typed placeholder for future extension.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  // Use the request to prevent ESLint unused variable errors
  if (!request.nextUrl) {
    console.log("Middleware called without url context");
  }
  return NextResponse.next();
}
