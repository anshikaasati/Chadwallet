// lib/config.ts

const requiredEnvVars = {
  birdeyeApiKey: process.env.BIRDEYE_API_KEY,
  privyAppSecret: process.env.PRIVY_APP_SECRET,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

// Validate that all required environment variables are present at startup
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(
      `Startup Error: Missing required server-side environment variable "${
        key === "birdeyeApiKey"
          ? "BIRDEYE_API_KEY"
          : key === "privyAppSecret"
          ? "PRIVY_APP_SECRET"
          : "SUPABASE_SERVICE_ROLE_KEY"
      }". Please check your .env.local file.`
    );
  }
}

export const birdeyeApiKey = requiredEnvVars.birdeyeApiKey!;
export const privyAppSecret = requiredEnvVars.privyAppSecret!;
export const supabaseServiceRoleKey = requiredEnvVars.supabaseServiceRoleKey!;
