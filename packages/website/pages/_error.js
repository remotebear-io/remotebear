import { GetInTouchButton } from "components/buttons";
import Head from "components/head";
import { Headline } from "components/headline";
import Layout from "components/layout";
import Link from "components/link";
import { Underline } from "components/underline";
import { trackEvent } from "lib/plausible";
import { useEffect } from "react";

function Error() {
  useEffect(() => {
    trackEvent("500", { path: document.location.pathname });
  }, []);
  return (
    <Layout>
      <Head title="500 | Remotebear" />
      <Headline
        title={
          <>
            <Underline>Yikes,</Underline>
            <br />
            something&apos;s gone wrong!
          </>
        }
        subtitle={
          <>
            We&apos;re sorry, something went wrong on our end and we can&apos;t
            get you the page&nbsp;
            <span className="inline-block">you&apos;re looking for :(</span>
          </>
        }
      />
      <div className="flex mt-12 md:mb-18 mb-8 flex-col text-gray-700 text-lg md:text-xl">
        <p>
          While we investigate the issue, why don&apos;t you try one of these
          links?
        </p>
        <ul className="list-inside list-disc pt-4 mb-6">
          <li className="mb-1">
            <Link
              href="/"
              className="text-blue-600 font-medium hover:underline"
            >
              Remote jobs
            </Link>
          </li>
          <li className="mb-1">
            <Link
              href="/companies"
              className="text-blue-600 font-medium hover:underline"
            >
              Remote companies
            </Link>
          </li>
          <li className="mb-1">
            <Link
              href="/about"
              className="text-blue-600 font-medium hover:underline"
            >
              About us
            </Link>
          </li>
        </ul>
        Need help? <GetInTouchButton uppercaseFirst />
      </div>
    </Layout>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
