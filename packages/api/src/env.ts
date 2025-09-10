import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z } from "zod";

expand(
  config({
    path: path.resolve(process.cwd(), process.env.NODE_ENV === "test" ? ".env.test" : ".env"),
  }),
);

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(9999),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).optional(),
  CORS_ORIGINS: z.string().default("http://localhost:3000"),
  PRIVATE_KEY: z.string(),
  RPC_URL: z.string(),
  DATABASE_URL: z.string(),
  EXECUTION_VERIFIER_ADDRESS: z.string(),
  // S3 Configuration
  // AWS credentials are automatically provided by Lambda execution role
  AWS_REGION: z.string().default("sa-east-1"),
  ASSETS_URL: z.string().optional(),
  ASSETS_BUCKET_NAME: z.string().optional(),
});

export type env = z.infer<typeof EnvSchema>;

const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
  console.error("❌ Invalid env:");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export default env!;
