// services/http.client.ts
import { ApiError, NetworkError } from "@/lib/errors";

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);

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
      throw err;
    }
    
    // Convert generic fetch failures to typed NetworkError
    throw new NetworkError(
      err instanceof Error ? err.message : "A connection error occurred while fetching the resource."
    );
  }
}
