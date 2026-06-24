// services/privy.service.ts
import { AppUser } from "@/types";

export class PrivyService {
  /**
   * Verifies a Privy access token/JWT.
   * Returns the parsed AppUser representation if valid, or null.
   */
  async verifySessionToken(token: string): Promise<AppUser | null> {
    // TODO: Verify Privy JWT using privyServerClient
    return {
      id: "did:privy:dummy",
      walletAddress: "Abc...xyz",
      email: "test@example.com",
      createdAt: new Date().toISOString(),
    };
  }
}

export const privyService = new PrivyService();
export default privyService;
