import { GetInTouchButton } from "components/buttons";
import Head from "components/head";
import Layout from "components/layout";
import Link from "components/link";
import { Underline } from "components/underline";

export default function About() {
  return (
    <Layout>
      <Head
        title="About us | Remotebear"
        description="Remotebear is the remote jobs aggregator that helps you find work that you love."
        pathname="/about"
      />
      <div className="flex mt-12 md:mt-20 md:mb-18 mb-8 flex-col">
        <h1
          className="font-serif text-gray-900 text-4xl md:text-5xl font-bold mb-6"
          style={{ letterSpacing: -1 }}
        >
          About <Underline>remotebear</Underline>
        </h1>
        <p className="text-gray-700 text-lg md:text-xl">
          Remotebear is the remote jobs aggregator that helps you find&nbsp;
          <b>work that you love</b>.
          <br />
          <br />
          Our focus is letting <b>you</b> decide which company and location you
          care about and keep you up-to-date with the available remote
          positions.
          <br />
          <br />
          We <b>don&apos;t hand-pick</b> remote jobs for you. We believe there
          are no one-size-fits-all solutions and you shouldn&apos;t miss any of
          them.
          <br />
          <br />
          We don&apos;t block content behind paywalls: you can browse&nbsp;
          <b>all the jobs offer</b> without any account and without signing-up.
          <br />
          <br />
          We <b>respect your privacy</b>. Your data always belongs to you, and
          only you, so{" "}
          <Link
            href="/privacy"
            className="text-blue-600 font-medium hover:underline"
          >
            we don’t collect sensitive personal data
          </Link>
          .
          <br />
          <br />
          We&apos;re <b>small but dedicated</b>: we&apos;re constantly adding
          new companies, improving the search results, and adding new
          (non-invasive) features.
          <br />
          <br />
          We&apos;re developing Remotebear in the open:{" "}
          <b>Remotebear&apos;s source code is open-source</b> and available on{" "}
          <Link
            href="https://github.com/remotebear-io/remotebear"
            className="text-blue-600 font-medium hover:underline"
          >
            GitHub
          </Link>
          .
          <br />
          <br />
          If you&apos;re a company interested in collaborations, or if you wanna
          provide feedback and suggestions, please&nbsp;
          <GetInTouchButton />.
        </p>
      </div>
    </Layout>
  );
}
