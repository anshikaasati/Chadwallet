// services/supabase.service.ts
import { AppUser, Position } from "@/types";

export class SupabaseService {
  /**
   * Retrieves a user by their Privy user ID.
   */
  async getUser(userId: string): Promise<AppUser | null> {
    // TODO: Query users table using createServerClient
    return null;
  }

  /**
   * Creates or updates a user record.
   */
  async upsertUser(user: AppUser): Promise<AppUser> {
    // TODO: Upsert into users table
    return user;
  }

  /**
   * Retrieves all asset positions for a user.
   */
  async getUserPositions(userId: string): Promise<Position[]> {
    // TODO: Query positions table
    return [];
  }

  /**
   * Creates or updates an asset position balance.
   */
  async upsertPosition(position: Position): Promise<Position> {
    // TODO: Upsert into positions table
    return position;
  }
}

export const supabaseService = new SupabaseService();
export default supabaseService;
