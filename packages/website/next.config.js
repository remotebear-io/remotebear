const { createSecureHeaders } = require("next-secure-headers");
const generateRobotsTxt = require("./scripts/generate-robots-txt");
const generateSitemap = require("./scripts/generate-sitemap");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },
  env: {
    VERCEL_ENV: process.env.VERCEL_ENV,
  },
  poweredByHeader: false,
  experimental: {
    // Experimental support for scroll-restoration
    scrollRestoration: true,
  },
  future: {
    // We can't enable Webpack 5 because it breaks NextJS' support of reading
    // the file system from a serverless function...
    // Which is a huge bummer, especially because with Webpack 5 we could use
    // Node's 14 "externals" and define in a more cleaner way the data-api
    // exports without side-effects.
    // webpack5: true,
  },
  async headers() {
    if (process.env.NODE_ENV !== "production") {
      return [];
    }
    return [
      {
        source: "/:path*",
        headers: createSecureHeaders({
          contentSecurityPolicy: {
            directives: {
              defaultSrc: ["'self'"], // Could be set to "'none'" once prefetchSrc is available
              scriptSrc: [
                "'self'",
                "'sha256-k1+J4E/iyliaOj7z0oNc010yBezbwv6xveDwOA+LaIg='", // Scroll restoration
                "*.remotebear.io",
              ],
              prefetchSrc: ["'self'"],
              fontSrc: ["'self'"],
              connectSrc: [
                "'self'",
                "*.vercel-insights.com",
                "*.remotebear.io",
              ],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", "data:"],
              baseUri: ["'self'"],
              formAction: ["'self'"],
              manifestSrc: ["'self'"],
              frameAncestors: true,
            },
          },
          frameGuard: "deny",
          noopen: "noopen",
          nosniff: "nosniff",
          xssProtection: "sanitize",
          forceHTTPSRedirect: [
            true,
            { maxAge: 60 * 60 * 24 * 360, includeSubDomains: true },
          ],
          referrerPolicy: "same-origin",
        }),
      },
    ];
  },
  webpack(config, { isServer }) {
    if (isServer) {
      generateSitemap();
      generateRobotsTxt();
    }
    return config;
  },
});
