// services/supabase.service.ts
import { AppUser, Position } from "@/types";
import { createServerClient } from "@/lib/supabase/server";
import { DatabaseError } from "@/lib/errors";

interface DbUser {
  id: string;
  wallet_address: string | null;
  email: string | null;
  created_at: string;
}

interface DbPosition {
  id?: string;
  user_id: string;
  token_address: string;
  token_symbol: string;
  balance: number;
  avg_entry_price: number | null;
  updated_at: string;
}

function mapDbUserToAppUser(dbUser: DbUser): AppUser {
  return {
    id: dbUser.id,
    walletAddress: dbUser.wallet_address,
    email: dbUser.email,
    createdAt: dbUser.created_at,
  };
}

function mapAppUserToDbUser(user: AppUser): DbUser {
  return {
    id: user.id,
    wallet_address: user.walletAddress,
    email: user.email,
    created_at: user.createdAt,
  };
}

function mapDbPositionToPosition(dbPos: DbPosition): Position {
  return {
    id: dbPos.id,
    userId: dbPos.user_id,
    tokenAddress: dbPos.token_address,
    tokenSymbol: dbPos.token_symbol,
    balance: Number(dbPos.balance),
    avgEntryPrice: dbPos.avg_entry_price !== null ? Number(dbPos.avg_entry_price) : null,
    updatedAt: dbPos.updated_at,
  };
}

function mapPositionToDbPosition(pos: Position): DbPosition {
  return {
    id: pos.id,
    user_id: pos.userId,
    token_address: pos.tokenAddress,
    token_symbol: pos.tokenSymbol,
    balance: pos.balance,
    avg_entry_price: pos.avgEntryPrice,
    updated_at: pos.updatedAt,
  };
}

export class SupabaseService {
  /**
   * Retrieves a user by their Privy user ID.
   */
  async getUser(userId: string): Promise<AppUser | null> {
    try {
      const client = createServerClient();
      const { data, error } = await client
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        throw new DatabaseError(`Failed to retrieve user: ${error.message}`);
      }

      if (!data) {
        return null;
      }

      return mapDbUserToAppUser(data as DbUser);
    } catch (err) {
      if (err instanceof DatabaseError) throw err;
      throw new DatabaseError(
        err instanceof Error ? err.message : "An unexpected database error occurred while querying user."
      );
    }
  }

  /**
   * Creates or updates a user record.
   */
  async upsertUser(user: AppUser): Promise<AppUser> {
    try {
      const client = createServerClient();
      const dbUser = mapAppUserToDbUser(user);

      const { data, error } = await client
        .from("users")
        .upsert(dbUser)
        .select()
        .single();

      if (error) {
        throw new DatabaseError(`Failed to upsert user: ${error.message}`);
      }

      return mapDbUserToAppUser(data as DbUser);
    } catch (err) {
      if (err instanceof DatabaseError) throw err;
      throw new DatabaseError(
        err instanceof Error ? err.message : "An unexpected database error occurred while upserting user."
      );
    }
  }

  /**
   * Retrieves all asset positions for a user.
   */
  async getUserPositions(userId: string): Promise<Position[]> {
    try {
      const client = createServerClient();
      const { data, error } = await client
        .from("positions")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        throw new DatabaseError(`Failed to retrieve positions: ${error.message}`);
      }

      return (data as DbPosition[]).map(mapDbPositionToPosition);
    } catch (err) {
      if (err instanceof DatabaseError) throw err;
      throw new DatabaseError(
        err instanceof Error ? err.message : "An unexpected database error occurred while querying positions."
      );
    }
  }

  /**
   * Creates or updates an asset position balance.
   */
  async upsertPosition(position: Position): Promise<Position> {
    try {
      const client = createServerClient();
      const dbPosition = mapPositionToDbPosition(position);

      const { data, error } = await client
        .from("positions")
        .upsert(dbPosition, {
          onConflict: "user_id,token_address",
        })
        .select()
        .single();

      if (error) {
        throw new DatabaseError(`Failed to upsert position: ${error.message}`);
      }

      return mapDbPositionToPosition(data as DbPosition);
    } catch (err) {
      if (err instanceof DatabaseError) throw err;
      throw new DatabaseError(
        err instanceof Error ? err.message : "An unexpected database error occurred while upserting position."
      );
    }
  }
}

export const supabaseService = new SupabaseService();
export default supabaseService;
