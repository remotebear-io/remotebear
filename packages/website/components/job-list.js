import Link from "next/link";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { infiniteScrollEnabled } from "config/config";
import {
  MemoizedSeparatorAwareJobListItem,
  JobListItemSkeleton,
  JobListSeparatorSkeleton,
} from "components/job-list-item";
import { areArrayEqualsByKey, buildJobsApiUrl, isServerSide } from "lib/utils";
import { Button, GetInTouchButton } from "./buttons";
import Pagination from "./pagination";
import { useSWRInfinite } from "swr";
import { trackShowMoreClick } from "lib/plausible";

const loadingIndicatorDelay = 300;

export function useJobs({
  query,
  locationId,
  departmentId,
  initialData,
  companyId,
}) {
  const hasMountedRef = useRef(false);
  const prevDataRef = useRef([initialData]);
  const loadingSpeedTimerRef = useRef();
  const loadingNextPageSpeedTimerRef = useRef();
  const [isLoadingSlowly, setIsLoadingSlowly] = useState(false);
  const [isLoadingNextPageSlowly, setIsLoadingNextPageSlowly] = useState(false);
  const { data, setSize, isValidating } = useSWRInfinite(
    (index) =>
      buildJobsApiUrl({
        query,
        locationId,
        departmentId,
        companyId,
        page: index,
      }),
    undefined,
    {
      // initialData must be provided ONLY on the server side and on the first
      // render in order to make the infinite list be rehydrated correctly
      // https://github.com/vercel/swr/issues/284
      initialData: hasMountedRef.current ? undefined : [initialData],
      initialSize: 1,
      revalidateOnFocus: false,
    }
  );
  if (data) {
    // We cache the last fetched data because we don't want to show the loading
    // indicator immediately.
    prevDataRef.current = data;
  }
  const jobs = data?.flatMap((x) => x.items) || prevDataRef.current[0].items;
  const pagination =
    data?.[data.length - 1]?.pagination ||
    prevDataRef.current[prevDataRef.current.length - 1].pagination;
  const isLastPage = !pagination.nextPage;
  const isEmpty = data?.[0]?.length === 0;

  useEffect(() => {
    hasMountedRef.current = true;
  }, []);

  // We wanna provide a feedback to the user when we're loading results,
  // but only after a short delay.
  // From a UX standpoint, if an update takes less than ~200 ms to appear, the
  // perception is that it's an instant update.
  useEffect(() => {
    if (!data && !isLoadingSlowly) {
      loadingSpeedTimerRef.current = setTimeout(
        setIsLoadingSlowly,
        loadingIndicatorDelay,
        true
      );
    } else if (data && isLoadingSlowly) {
      setIsLoadingSlowly(false);
    }
    return () => clearTimeout(loadingSpeedTimerRef.current);
  }, [data, isLoadingSlowly]);
  useEffect(() => {
    if (data && isValidating && !isLoadingNextPageSlowly) {
      loadingNextPageSpeedTimerRef.current = setTimeout(
        setIsLoadingNextPageSlowly,
        loadingIndicatorDelay,
        true
      );
    } else if (!isValidating && isLoadingNextPageSlowly) {
      setIsLoadingNextPageSlowly(false);
    }
    return () => clearTimeout(loadingNextPageSpeedTimerRef.current);
  }, [data, isValidating, isLoadingNextPageSlowly]);

  const loadNextPage = useCallback(() => {
    if (isLastPage) {
      return;
    }
    setSize((size) => size + 1);
    trackShowMoreClick();
  }, [isLastPage]);

  if (!isServerSide()) {
    window.__debugging_job_list___ = {
      loadingSpeedTimerRef,
      loadingNextPageSpeedTimerRef,
      isLoadingSlowly,
      isLoadingNextPageSlowly,
      data,
      isValidating,
    };
  }

  return {
    jobs,
    pagination,
    isLoadingSlowly,
    isLoadingNextPageSlowly,
    loadNextPage,
    isEmpty,
  };
}

function JobList({ jobs, pagination, loadNextPage, loading, loadingNextPage }) {
  // const { loaderRef } = useInfiniteScroll({
  //   currentPage: pagination?.currentPage,
  //   enabled: infiniteScrollEnabled && pagination?.nextPage,
  //   distance: 500,
  //   onEndReached: loadNextPage,
  // });
  if (!jobs.length) {
    return <EmptyList />;
  }

  if (loading) {
    return (
      <>
        <JobListSeparatorSkeleton />
        <JobListItemSkeleton />
        <JobListItemSkeleton />
        <JobListItemSkeleton />
        <JobListItemSkeleton />
        <JobListItemSkeleton />
        <JobListItemSkeleton />
        <JobListItemSkeleton />
        <JobListItemSkeleton />
        <JobListItemSkeleton />
        <JobListItemSkeleton />
      </>
    );
  }

  return (
    <>
      {jobs.map((job, index) => {
        const prevJob = jobs[index - 1];
        const shouldShowSeparator =
          index === 0 || prevJob.formattedCreatedAt !== job.formattedCreatedAt;
        return (
          <MemoizedSeparatorAwareJobListItem
            key={job.id}
            job={job}
            shouldShowSeparator={shouldShowSeparator}
          />
        );
      })}
      <noscript>
        {pagination && <Pagination pagination={pagination} />}
      </noscript>
      <div className="js-only">
        <Footer
          pagination={pagination}
          loadNextPage={loadNextPage}
          loadingNextPage={loadingNextPage}
          // loaderRef={loaderRef}
        />
      </div>
    </>
  );
}

function Footer({ pagination, loadNextPage, loadingNextPage, loaderRef }) {
  if (!pagination) {
    return null;
  }
  if (pagination.nextPage) {
    if (infiniteScrollEnabled || loadingNextPage) {
      return (
        <div ref={loaderRef} className="pb-12">
          <JobListItemSkeleton />
        </div>
      );
    } else {
      return (
        <div className="flex justify-center items-center mt-6 pb-12">
          <Button onClick={loadNextPage}>Show more jobs...</Button>
        </div>
      );
    }
  }
  return (
    <div className="flex flex-col items-center p-4 md:text-lg pt-12 text-gray-800 pb-24">
      <p className="mb-12">
        Showing{" "}
        <span className="font-medium">{pagination.totalItemsCount}</span> of{" "}
        <span className="font-medium">{pagination.totalItemsCount}</span>{" "}
        results
      </p>
      <p className="mb-2">
        Still can&apos;t find what you&apos;re looking for?
      </p>
      <GetInTouchButton className="md:text-lg" uppercaseFirst />
    </div>
  );
}

function EmptyList() {
  return (
    <div className="flex flex-col w-full items-center md:mt-28 mt-4 mb-24">
      <div className="max-w-md text-gray-700 text-lg md:text-xl">
        <h3 className="text-xl font-medium mb-12 text-center text-gray-800 ">
          No results found
        </h3>
        <span className="font-medium">A few suggestions:</span>
        <ul className="list-inside list-disc pt-4">
          <li className="mb-1">Filter by title, company, or keyword.</li>
          <li className="mb-1">Double-check your spelling.</li>
          <li className="mb-1">Try more generic keywords.</li>
          <li className="mb-1">Avoid abbreviations.</li>
          <li className="mb-1">
            Browse our{" "}
            <Link href="/companies">
              <a className="text-blue-600 font-medium  hover:underline cursor-pointer">
                remote companies
              </a>
            </Link>
            .
          </li>
          <li className="mb-1">
            <GetInTouchButton className="md:text-lg" uppercaseFirst />.
          </li>
        </ul>
      </div>
    </div>
  );
}

function jobListPropsAreEqual(prevProps, nextProps) {
  return (
    areArrayEqualsByKey(prevProps.jobs, nextProps.jobs, "id") &&
    prevProps.pagination.currentPage === nextProps.pagination.currentPage &&
    prevProps.jobs.length === nextProps.jobs.length &&
    prevProps.onEndReached === nextProps.onEndReached &&
    prevProps.loading === nextProps.loading &&
    prevProps.loadingNextPage === nextProps.loadingNextPage
  );
}

export const MemoizedJobList = memo(JobList, jobListPropsAreEqual);
