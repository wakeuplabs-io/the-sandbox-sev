import { z } from "zod";
import { EnvSchema } from "./env-schema.js";

const env = {
  WEB3AUTH_CLIENT_ID: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
  API_URL: import.meta.env.VITE_API_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
};

const result = EnvSchema.safeParse(env);

if (!result.success) {
  console.error("Environment validation failed:", result.error.format());
  throw new Error(
    `Environment validation failed: ${result.error.issues.map(i => i.message).join(", ")}`
  );
}
export type UIEnv = z.infer<typeof EnvSchema>;
export default result.data;
