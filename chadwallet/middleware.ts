// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // Allow all users (both guests and authenticated) to access trade and terminal routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/trade/:path*"],
};
