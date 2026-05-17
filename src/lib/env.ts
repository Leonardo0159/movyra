import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
  SENTRY_DSN: z.string().url().or(z.literal("")).optional(),
  SENTRY_ENVIRONMENT: z.enum(["development", "staging", "production"]).default("development"),
  SENTRY_RELEASE: z.string().optional(),
});

export function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("\n");
    throw new Error(`Invalid environment variables:\n${errors}`);
  }

  return result.data;
}

export const env = validateEnv();
