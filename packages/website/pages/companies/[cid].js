import Head from "components/head";
import Layout from "components/layout";
import { Headline } from "components/headline";
import { Underline } from "components/underline";
import { fetchApi, prettifyUrl } from "lib/utils";
import Link from "components/link";
import { useJobs, MemoizedJobList } from "components/job-list";
import { GetInTouchButton } from "components/buttons";
import { Banner } from "components/banner";
import Image from "next/image";

const yearInSeconds = 60 * 60 * 24 * 365;

export async function getServerSideProps({ res, params }) {
  const companies = await fetchApi(`/api/companies?cid=${params.cid}`);
  const company = companies?.items?.[0];
  if (!company?.id) {
    return { notFound: true };
  }
  const jobs = await fetchApi(`/api/jobs?cid=${params.cid}`);

  res.setHeader(
    "Cache-Control",
    `s-maxage=${yearInSeconds}, stale-while-revalidate`
  );

  return {
    props: {
      initialData: {
        company,
        jobs,
      },
    },
  };
}

export default function Companies({ initialData }) {
  const { company } = initialData;
  const {
    jobs,
    pagination,
    isLoadingSlowly,
    isLoadingNextPageSlowly,
    loadNextPage,
  } = useJobs({
    companyId: company.id,
    initialData: initialData.jobs,
  });
  return (
    <Layout>
      <Head
        title={`${company.name} | Remotebear`}
        description={`Remotebear's list of remote jobs at ${company.name}`}
        pathname={`/companies/${company.id}`}
      />
      <Headline
        title={
          <Underline style={{ display: "inline-flex", alignItems: "center" }}>
            <div className="w-14 h-14 relative">
              <Image
                alt={`${company.name} logo`}
                src={company.logoUrl}
                className="rounded-sm z-10"
                layout="fill"
              />
            </div>
            <span className="ml-3">{company.name}</span>
          </Underline>
        }
        subtitle={<>{company.description}</>}
      />
      <div className="flex flex-row text-gray-700 text-lg md:text-lg mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6 text-gray-700 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
        <Link
          href={company.url}
          className="text-blue-600 font-medium hover:underline cursor-pointer"
        >
          {prettifyUrl(company.url)}
        </Link>
      </div>
      {company.numberOfEmployes && company.numberOfEmployes[1] ? (
        <div className="flex flex-row text-gray-700 text-lg md:text-lg mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 text-gray-700 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          Between{" "}
          {company.numberOfEmployes[0] === 0
            ? 0
            : company.numberOfEmployes[0] - 1}{" "}
          and {company.numberOfEmployes[1]} employes.
        </div>
      ) : undefined}
      <Banner type="info" className="mb-4">
        <span>
          Do you have any suggestion or request for this company page?&nbsp;
          <span className="inline-block">
            <GetInTouchButton uppercaseFirst hideIcon />.
          </span>
        </span>
      </Banner>
      <Banner type="info" className="mb-8 md:h-auto h-auto">
        <span>
          Did you know? You can also filter this company results in the{" "}
          <Link
            href={`/?q=${company.name.toLowerCase()}`}
            className="text-blue-600 font-medium hover:underline cursor-pointer"
          >
            main jobs list
          </Link>
          .
        </span>
      </Banner>
      {jobs?.length > 0 ? (
        <MemoizedJobList
          jobs={jobs}
          pagination={pagination}
          loadNextPage={loadNextPage}
          loading={isLoadingSlowly}
          loadingNextPage={isLoadingNextPageSlowly}
        />
      ) : (
        <>
          <div className="flex flex-col w-full items-center mt-28 mb-24">
            <div className="max-w-md text-gray-700 text-lg md:text-xl">
              <h3 className="text-xl font-medium mb-12 text-center text-gray-800 ">
                No remote jobs found
              </h3>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
