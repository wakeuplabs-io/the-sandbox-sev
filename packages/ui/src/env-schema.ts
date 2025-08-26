import { z } from "zod";

// UI Environment schema - pure validation rules without side effects
export const EnvSchema = z.object({
  WEB3AUTH_CLIENT_ID: z.string().min(1, "WEB3AUTH_CLIENT_ID is required"),
  API_URL: z.string().url("API_URL must be a valid URL (e.g., 'http://localhost:9999')"),
  NODE_ENV: z
    .enum(["development", "staging", "production"], {
      errorMap: () => ({
        message: "NODE_ENV must be 'development', 'staging', or 'production'",
      }),
    })
    .default("development"),
});
