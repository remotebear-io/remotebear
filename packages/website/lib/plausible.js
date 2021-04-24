import Head from "next/head";

export function PlausibleProvider({ children }) {
  const enabled =
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL_ENV === "production";
  if (!enabled) {
    return children;
  }
  return (
    <>
      <Head>
        <script
          async
          defer
          data-domain="remotebear.io"
          src="https://stats.remotebear.io/js/plausible.outbound-links.js"
        />
      </Head>
      {children}
    </>
  );
}

export function trackEvent(eventName, props) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL_ENV === "production"
  ) {
    return window?.plausible?.(eventName, { props });
  } else if (process.env.NODE_ENV === "development") {
    console.info(`%cTracking event "${eventName}"`, "color:blue", props);
  }
}

export function trackJobsSearchChange(props) {
  trackEvent("Jobs Filter: Search", props);
}

export function trackShowMoreClick(props) {
  trackEvent("Show More: Click", props);
}
