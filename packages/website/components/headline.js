import { GetInTouchButton } from "./buttons";
import Link from "./link";
import { Underline } from "./underline";

// TODO: Export this instead of the other ones
export function Headline({ title, subtitle }) {
  return (
    <div className="flex mt-12 md:mt-20 md:mb-18 mb-8 flex-col">
      <h1
        className="font-serif text-gray-900 text-4xl md:text-5xl font-bold mb-6"
        style={{ letterSpacing: -1 }}
      >
        {title}
      </h1>
      <h2 className="text-gray-700 text-lg md:text-xl">{subtitle}</h2>
    </div>
  );
}

export function HomeHeadline() {
  return (
    <Headline
      title={
        <>
          The best <Underline>remote jobs</Underline>
          <br />
          at leading tech companies
        </>
      }
      subtitle={
        <>
          Remotebear keeps you up to date with the latest remote job
          opportunities from the greatest{" "}
          <Link
            href="/companies"
            className="text-blue-600 font-medium  hover:underline cursor-pointer"
          >
            remote tech companies
          </Link>
          .
          <br />
          Discover and browse hundreds of jobs at your own pace: no account or
          sign-up required.
          <br />
        </>
      }
    />
  );
}

export function CompaniesHeadline() {
  return (
    <Headline
      title={
        <>
          Full-remote and remote-friendly tech&nbsp;
          <Underline>companies</Underline> and <Underline>startups</Underline>
        </>
      }
      subtitle={
        <>
          Discover remote companies of every size, from the largest distributed
          companies to new promising startups.
          <br />
          If you&apos;re a company interested in collaborations, please{" "}
          <GetInTouchButton />.
          <br />
          <br />
        </>
      }
    />
  );
}
