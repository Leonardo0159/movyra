export function getReleaseInfo() {
  return {
    release: process.env.SENTRY_RELEASE || process.env.VERCEL_GIT_COMMIT_SHA || "latest",
    environment: process.env.SENTRY_ENVIRONMENT || "development",
    dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  };
}
