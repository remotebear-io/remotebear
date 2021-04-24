import Head from "components/head";
import Layout from "components/layout";
import Link from "components/link";
import { Underline } from "components/underline";

export default function Privacy() {
  return (
    <Layout>
      <Head title="Privacy | Remotebear" />
      <div className="flex mt-12 md:mt-20 md:mb-18 mb-8 flex-col">
        <h1
          className="font-serif text-gray-900 text-5xl md:text-6xl font-bold mb-6"
          style={{ letterSpacing: -1 }}
        >
          <Underline>Privacy</Underline>
        </h1>
        <div className="w-full text-gray-700 text-lg md:text-xl">
          <p className="mb-6">
            Your data always belongs to you, and only you.
            <br />
            We don’t collect sensitive personal data.
          </p>
          <p className="mb-6">
            We use the open-source{" "}
            <Link
              className="text-blue-600 font-medium hover:underline"
              href="https://plausible.io/"
            >
              Plausible Analytics
            </Link>{" "}
            routed through our{" "}
            <code className="text-pink-900">stats.remotebear.io</code> domain to
            count website visits, interactions, etc. <br />
            No cookies are used and no personal data — not even an IP address or
            browser user agent — is stored. <br />
            For more information, see the{" "}
            <Link
              className="text-blue-600 font-medium hover:underline"
              href="https://plausible.io/data-policy"
            >
              Plausible Data Policy
            </Link>
            .
          </p>
          <p className="mb-6">
            We use{" "}
            <Link
              className="text-blue-600 font-medium hover:underline"
              href="https://nextjs.org/analytics"
            >
              NextJS Analytics
            </Link>{" "}
            to collect metrics that allow us to improve the user experience.
            <br />
            The collected data is not tied to, or associated with, any
            individual visitor or IP address. The recording of data points is
            anonymous and NextJS Analytics does not collect or store information
            that would enable us to reconstruct a browsing session across pages
            or identify a user.
            <br />
            For more information, see the{" "}
            <Link
              className="text-blue-600 font-medium hover:underline"
              href="https://vercel.com/docs/analytics#privacy"
            >
              NextJS Analytics Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </Layout>
  );
}
