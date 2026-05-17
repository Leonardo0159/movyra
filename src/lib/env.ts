import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url().refine((url) => {
    if (process.env.NODE_ENV === "production") {
      return url.includes("sslmode=require") || url.startsWith("prisma+postgres");
    }
    return true;
  }, "DATABASE_URL must use SSL in production"),
  REDIS_URL: z.string().url().optional(),
  SENTRY_DSN: z.string().url().optional(),
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
