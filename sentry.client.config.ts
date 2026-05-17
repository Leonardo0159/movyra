import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT || "development",
  release: process.env.SENTRY_RELEASE || "latest",
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  profilesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 1.0,
  beforeSend(event) {
    // Sanitize PII before sending to Sentry
    if (event.request?.headers) {
      delete event.request.headers;
    }
    if (event.user?.email) {
      event.user.email = "[REDACTED]";
    }
    if (event.user?.ip_address) {
      delete event.user.ip_address;
    }
    return event;
  },
});
