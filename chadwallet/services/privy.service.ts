// services/privy.service.ts
import { AppUser } from "@/types";
import { privyServerClient } from "@/lib/privy/server";
import { ApiError } from "@/lib/errors";

export class PrivyService {
  /**
   * Extracts and verifies the Privy JWT token from the Authorization request header.
   * Throws a 401 ApiError if missing, invalid, or expired.
   */
  async getAuthFromRequest(req: {
    headers: { get(name: string): string | null };
  }): Promise<{ userId: string; walletAddress: string | null }> {
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

    return this.verifyAuthToken(token);
  }

  /**
   * Verifies a Privy authorization token (JWT claims) and loads the full user
   * profile to find any linked Solana wallets.
   */
  async verifyAuthToken(token: string): Promise<{ userId: string; walletAddress: string | null }> {
    try {
      const claims = await privyServerClient.verifyAuthToken(token);
      if (!claims || !claims.userId) {
        throw new ApiError("UNAUTHORIZED", "Invalid or missing Privy claims payload.", 401);
      }

      // Fetch user profile from Privy API
      const user = await privyServerClient.getUser(claims.userId);
      
      // Find the first linked Solana wallet account
      const solanaWallet = user.linkedAccounts.find((acc) => {
        if (acc.type !== "wallet") return false;
        const walletAcc = acc as unknown as Record<string, unknown>;
        return (
          walletAcc.chainType === "solana" ||
          (typeof walletAcc.address === "string" &&
            walletAcc.address.length >= 32 &&
            walletAcc.address.length <= 44)
        );
      });

      const walletAddress = solanaWallet ? (solanaWallet as unknown as Record<string, unknown>).address as string : null;

      return {
        userId: claims.userId,
        walletAddress,
      };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        "UNAUTHORIZED",
        err instanceof Error ? err.message : "Privy signature verification failed.",
        401
      );
    }
  }

  /**
   * Edge-safe auth session helper (returns AppUser payload or null).
   */
  async verifySessionToken(token: string): Promise<AppUser | null> {
    try {
      const { userId, walletAddress } = await this.verifyAuthToken(token);
      const user = await privyServerClient.getUser(userId);

      const emailAccount = user.linkedAccounts.find((acc) => acc.type === "email");
      const email = emailAccount
        ? ((emailAccount as unknown as Record<string, unknown>).address as string)
        : null;

      return {
        id: userId,
        walletAddress,
        email,
        createdAt: new Date(user.createdAt).toISOString(),
      };
    } catch {
      return null;
    }
  }
}

export const privyService = new PrivyService();
export default privyService;
