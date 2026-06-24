// services/http.client.ts
import { ApiError, NetworkError } from "@/lib/errors";

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const maxRetries = 3;
  let delay = 600; // start with 600ms delay

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.status === 429 && attempt < maxRetries) {
        console.warn(`[HTTP Client] Hit 429 rate limit. Retrying attempt ${attempt}/${maxRetries} after ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2.5; // exponential backoff multiplier
        continue;
      }

      if (!response.ok) {
        let errorBody: { error?: { code?: string; message?: string } } | null = null;
        
        try {
          errorBody = await response.json();
        } catch {
          // Fallback if body is not JSON or empty
        }

        const code = errorBody?.error?.code || "API_RESPONSE_ERROR";
        const message = errorBody?.error?.message || `Request to ${url} failed with status ${response.status}`;
        
        throw new ApiError(code, message, response.status);
      }

      // Parse the JSON data envelope if it exists
      const result = await response.json();
      return result as T;
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 429 && attempt < maxRetries) {
          console.warn(`[HTTP Client] Hit 429 ApiError. Retrying attempt ${attempt}/${maxRetries} after ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2.5;
          continue;
        }
        throw err;
      }
      
      if (attempt < maxRetries) {
        console.warn(`[HTTP Client] Network error: ${err instanceof Error ? err.message : String(err)}. Retrying...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2.5;
        continue;
      }

      // Convert generic fetch failures to typed NetworkError
      throw new NetworkError(
        err instanceof Error ? err.message : "A connection error occurred while fetching the resource."
      );
    }
  }

  throw new NetworkError("Request failed after maximum retries");
}
