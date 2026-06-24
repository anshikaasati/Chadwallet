// lib/auth.ts
import { NextRequest } from "next/server";
import { privyService } from "@/services/privy.service";
import { ApiError } from "@/lib/errors";

export interface AuthenticatedUserPayload {
  userId: string;
  walletAddress: string | null;
}

/**
 * Extracts and verifies the Privy JWT token from the Authorization request header.
 * Throws a 401 ApiError if missing, invalid, or expired.
 */
export async function getAuthFromRequest(
  req: NextRequest
): Promise<AuthenticatedUserPayload> {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(
      "UNAUTHORIZED",
      "Missing or invalid Authorization Bearer token header.",
      401
    );
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    throw new ApiError("UNAUTHORIZED", "Empty session authorization token.", 401);
  }

  // Call the Privy verification service
  return privyService.verifyAuthToken(token);
}
