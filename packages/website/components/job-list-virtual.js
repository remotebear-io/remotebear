/**
 * The virtual list is not currently being used because the static one seems to
 * be performant enough.
 */
/* eslint-disable react/display-name */
import Link from "next/link";
import { memo } from "react";
import { Virtuoso } from "react-virtuoso";
import { infiniteScrollEnabled } from "config/config";
import {
  MemoizedSeparatorAwareJobListItem,
  JobListItemSkeleton,
  JobListSeparatorSkeleton,
} from "components/job-list-item";
import { areArrayEqualsByKey, isServerSide, times } from "lib/utils";
import { Button, GetInTouchButton } from "./buttons";
import Pagination from "./pagination";

function JobList({ jobs, pagination, loadNextPage, loading, loadingNextPage }) {
  if (!jobs.length) {
    return <EmptyList />;
  }

  const items = !loading ? jobs : times(10);
  return (
    <Virtuoso
      useWindowScroll
      data={items}
      itemContent={(index) => {
        // If loading, show a shimmering skeleton.
        // We show it directly within the virtualized list instead of doing
        // it outside of it to avoid having to re-instantiate it again.
        if (loading) {
          return index === 0 ? (
            <>
              <JobListSeparatorSkeleton />
              <JobListItemSkeleton />
            </>
          ) : (
            <JobListItemSkeleton />
          );
        }
        // Otherwise, let's go with the list items.
        const job = items[index];
        const prevJob = items[index - 1];
        const shouldShowSeparator =
          index === 0 || prevJob.formattedCreatedAt !== job.formattedCreatedAt;
        return (
          <>
            <MemoizedSeparatorAwareJobListItem
              job={job}
              shouldShowSeparator={shouldShowSeparator}
            />
            {/** Horrible, horrible hack to show the pagination buttons when JS
             * is disabled. We can't add it to the footer because the footer is
             * not rendered correctly on the server-side.
             */}
            {index === items.length - 1 ? (
              <noscript>
                <Pagination pagination={pagination} />
              </noscript>
            ) : undefined}
          </>
        );
      }}
      // "initialItemCount" is used for server-side rendering — if set, the list
      // will render the specified amount of items regardless of the container
      // size.
      // Following the server-side rendering, the hydration process doesn't
      // work correctly with the document scroller (through "useWindowScroll"),
      // so as an hack we set "initialItemCount" to null as soon as we're on the
      // client. By doing so, we get a React warning on the console:
      // "Did not expect server HTML to contain a <div> in <div>".
      // I think we can safely ignore it for now.
      initialItemCount={isServerSide() ? items.length : null}
      totalCount={items.length}
      // TODO: Uncomment for enabling infinite loading
      // endReached={() => !loading && loadNextPage()}
      overscan={600}
      // By deferring the footer render on the server-side we avoid a weird
      // glitchy jump.
      components={{
        Footer: () => (
          <Footer
            pagination={pagination}
            loadNextPage={loadNextPage}
            loadingNextPage={loadingNextPage}
          />
        ),
      }}
    />
  );
}

function Footer({ pagination, loadNextPage, loadingNextPage, loaderRef }) {
  if (isServerSide() || !pagination) {
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
        <p>
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
        </p>
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
