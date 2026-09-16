const DEFAULT_SITE_URL = "https://portfolio.prav1nos.me";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
).replace(/\/$/, "");
