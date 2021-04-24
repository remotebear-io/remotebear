import { GetInTouchButton } from "components/buttons";
import Head from "components/head";
import Layout from "components/layout";
import Link from "components/link";
import { Underline } from "components/underline";
import { trackEvent } from "lib/plausible";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    trackEvent("404", { path: document.location.pathname });
  }, []);
  return (
    <Layout>
      <Head title="Page not found | Remotebear" />
      <div className="flex mt-12 md:mt-20 md:mb-18 mb-8 flex-col">
        <h1
          className="font-serif text-gray-900 text-5xl md:text-6xl font-bold mb-6"
          style={{ letterSpacing: -1 }}
        >
          <Underline>Oops!</Underline>
        </h1>
        <div className="max-w-md text-gray-700 text-lg md:text-xl">
          <p className="mb-6">
            We can&apos;t seem to find the page{" "}
            <span className="inline-block">you&apos;re looking for :(</span>
          </p>
          <p>Here are some helpful links instead:</p>
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
      </div>
    </Layout>
  );
}
