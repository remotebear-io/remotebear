import Layout from "components/layout";
import Head from "components/head";
import { HomeHeadline } from "components/headline";
import Search from "components/search";
import { useEffect, useState } from "react";
import { MemoizedJobList, useJobs } from "components/job-list";
import { fetchJobsApi, sanitizeString } from "lib/utils";
import { useRouter } from "next/router";
import { trackJobsSearchChange } from "lib/plausible";
import { useDebouncedEffect } from "lib/hooks";

const yearInSeconds = 60 * 60 * 24 * 365;

export async function getServerSideProps({ res, query }) {
  const q = sanitizeString(query?.q || "").trim();
  const l = sanitizeString(query?.l || "").trim();
  const d = sanitizeString(query?.d || "").trim();
  const p = sanitizeString(query?.p || "").trim();
  const data = await fetchJobsApi({
    query: q,
    locationId: l,
    departmentId: d,
    page: p,
  });
  res.setHeader(
    "Cache-Control",
    `s-maxage=${yearInSeconds}, stale-while-revalidate`
  );
  return {
    props: {
      initialData: data,
      initialQuery: q,
      initialLocationId: l,
      initialDepartmentId: d,
    },
  };
}

export default function Home(props) {
  return (
    <Layout>
      <Head
        title="Remotebear: The best remote jobs at leading tech companies"
        description="Remotebear keeps you up to date with the latest remote job opportunities from the greatest remote tech companies — no account or sign-up required."
        canonical=""
      />
      <HomeHeadline />
      <HomeContent {...props} />
    </Layout>
  );
}

function HomeContent({
  initialData,
  initialQuery,
  initialLocationId,
  initialDepartmentId,
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [locationId, setLocationId] = useState(initialLocationId);
  const [departmentId, setDepartmentId] = useState(initialDepartmentId);
  const {
    jobs,
    pagination,
    isLoadingSlowly,
    isLoadingNextPageSlowly,
    loadNextPage,
  } = useJobs({
    query,
    locationId,
    departmentId,
    initialData,
  });

  const handleFilterChange = (filterFieldName, filterFieldValue) => {
    const filterSetters = {
      query: setQuery,
      locationId: setLocationId,
      departmentId: setDepartmentId,
    };
    filterSetters[filterFieldName](filterFieldValue || "");
  };

  useEffect(() => {
    const queryParams = {};
    if (query) queryParams.q = query;
    if (locationId) queryParams.l = locationId;
    if (departmentId) queryParams.d = departmentId;
    router.replace({ query: queryParams }, undefined, { shallow: true });
  }, [query, locationId, departmentId]);

  useDebouncedEffect(
    () => {
      if (query || locationId || departmentId) {
        trackJobsSearchChange({
          query: query,
          locationId: locationId,
          departmentId: departmentId,
        });
      }
    },
    [query, locationId, departmentId],
    2000
  );

  return (
    <>
      <Search
        query={query}
        onFilterChange={handleFilterChange}
        locationId={locationId}
        departmentId={departmentId}
      />
      <MemoizedJobList
        jobs={jobs}
        pagination={pagination}
        loadNextPage={loadNextPage}
        loading={isLoadingSlowly}
        loadingNextPage={isLoadingNextPageSlowly}
      />
    </>
  );
}
