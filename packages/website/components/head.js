import { scrollRestoration } from "config/config";
import NextHead from "next/head";

const defaultTitle = "Remotebear";
const defaultDescription =
  "Remotebear keeps you up to date with the latest remote job opportunities from the greatest remote tech companies.";

export default function Head({
  title = defaultTitle,
  description = defaultDescription,
  pathname = "",
  canonical,
}) {
  // prettier-ignore
  return (
    <NextHead>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Favicon */}
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"/>
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"/>
      <link rel="manifest" href="/favicon/site.webmanifest"/>
      <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5"/>
      <meta name="msapplication-TileColor" content="#da532c"/>
      <meta name="theme-color" content="#ffffff"></meta>

      {/* Canonical URL for SEO */}
      {canonical !== undefined ? <link rel="canonical" href={`https://remotebear.io${canonical}`} /> : undefined}

      {/* Preload woff2 only since all browsers that support meta preload also support woff2 */}
      <link rel="preload" href="/fonts/SourceSerifPro-Bold.min.3c9ad0e69f.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/fonts/SourceSerifPro-SemiBold.min.0c030c830a.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

      {!scrollRestoration&& (
        <>
          {/* We're dealing with virtualized lists, tell the browser to not restore the scroll position on load */}
          <script dangerouslySetInnerHTML={{__html: `history.scrollRestoration = "manual"`}}/>
        </>
      )}

      {/* Open Graph */}
      <meta property="og:url" content={`https://remotebear.io${pathname}`} key="ogurl" />
      <meta property="og:image" content="https://remotebear.io/seo/logo-512-512.png" key="ogimage" />
      <meta property="og:site_name" content="Remotebear" key="ogsitename" />
      <meta property="og:title" content={title} key="ogtitle" />
      <meta property="og:description" content={description} key="ogdesc" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" key="twcard" />
      <meta name="twitter:creator" content="@remotebear_io" key="twhandle" />

    </NextHead>
  );
}
