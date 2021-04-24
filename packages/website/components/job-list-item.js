import Image from "next/image";
import { memo } from "react";
import Link from "next/link";

export function JobListItem({ job }) {
  const isNormalizedLocationValid = !!job.normalizedLocation.length;
  return (
    <>
      <Link href={job.url}>
        <a className="flex flex-col p-2" target="_blank" rel="noreferrer">
          <div className="flex align-middle">
            <span className="font-medium md:text-lg">{job.title}</span>
          </div>
          <div className="flex md:flex-row flex-col-reverse text-gray-700 md:text-lg">
            <span className="flex flex-row">
              <div
                className="mr-2"
                style={{ marginTop: 2, minHeight: 16, minWidth: 16 }}
              >
                <Image
                  alt={`${job.company.name} logo`}
                  width={16}
                  height={16}
                  src={job.company.iconUrl}
                />
              </div>
              {job.company.name}
            </span>
            <span className="hidden md:flex">&nbsp;∙&nbsp;</span>
            <span
              className={`md:overflow-ellipsis md:whitespace-nowrap md:overflow-hidden ${
                isNormalizedLocationValid ? "" : "text-red-700"
              }`}
            >
              {job.location}
            </span>
          </div>
        </a>
      </Link>
      <style jsx>{`
        @media (hover: hover) {
          a {
            position: relative;
          }
          a:hover:before {
            content: "";
            position: absolute;
            top: 0;
            left: -8px;
            right: -8px;
            height: 100%;
            z-index: -1;
            background: #f9fafb;
            border: 1px solid #f3f4f6;
          }
        }
      `}</style>
    </>
  );
}

export function JobListSeparator({ title }) {
  return (
    <div className="font-serif font-semibold md:text-2xl text-xl text-gray-800 inline-block pb-3 pt-4">
      <span className="custom-highlight">{title}</span>
      <style jsx>{`
        .custom-highlight {
          position: relative;
          display: inline-block;
        }
        .custom-highlight::before {
          content: "";
          position: absolute;
          z-index: -1;
          top: -0.2rem;
          bottom: -0.2rem;
          left: -1.3rem;
          right: -0.4rem;
          background: #d9f1f1;
          transform: rotate(-1deg) skewX(-12deg);
        }
      `}</style>
    </div>
  );
}

export function SeparatorAwareJobListItem({ job, shouldShowSeparator }) {
  return (
    <>
      {shouldShowSeparator && (
        <JobListSeparator title={job.formattedCreatedAt} />
      )}
      <JobListItem job={job} />
    </>
  );
}

function separatorAwareJobListItemPropsAreEqual(prevProps, nextProps) {
  return (
    prevProps.job.id === nextProps.job.id &&
    prevProps.shouldShowSeparator === nextProps.shouldShowSeparator
  );
}

export const MemoizedSeparatorAwareJobListItem = memo(
  SeparatorAwareJobListItem,
  separatorAwareJobListItemPropsAreEqual
);

export function JobListItemSkeleton() {
  return (
    <div className="flex flex-col p-2 rounded-md pb-6">
      <span className="shimmer w-2/3 h-6 rounded-md md:w-1/3"></span>
      <div className="flex flex-row mt-2">
        <div className="shimmer w-6 h-6 mr-2 rounded-md" />
        <span className="shimmer w-3/4 md:w-1/2 h-6 rounded-md"></span>
      </div>
      <style jsx>{`
        .shimmer {
          background: #e3e4e6;
          background-image: linear-gradient(
            to right,
            #e3e4e6 0%,
            #edeef1 20%,
            #e3e4e6 40%,
            #e3e4e6 100%
          );
          background-repeat: no-repeat;
          background-size: 800px 104px;
          display: inline-block;
          position: relative;
          animation-duration: 1s;
          animation-fill-mode: forwards;
          animation-iteration-count: infinite;
          animation-name: shimmer;
          animation-timing-function: linear;
        }

        @keyframes shimmer {
          0% {
            background-position: -468px 0;
          }

          100% {
            background-position: 468px 0;
          }
        }
      `}</style>
    </div>
  );
}

export function JobListSeparatorSkeleton() {
  return (
    <div className="font-serif font-semibold md:text-2xl text-xl inline-block pb-3 pt-4">
      <span className="skeleton-highlight">Today</span>
      <style jsx>{`
        .skeleton-highlight {
          position: relative;
          display: inline-block;
          color: rgba(0, 0, 0, 0);
        }
        .skeleton-highlight::before {
          content: "";
          position: absolute;
          z-index: -1;
          top: -0.2rem;
          bottom: -0.2rem;
          left: -1.3rem;
          right: -0.4rem;
          background: #d9f1f1;
          transform: rotate(-1deg) skewX(-12deg);
          background: #e3e4e6;
          background-image: linear-gradient(
            to right,
            #e3e4e6 0%,
            #edeef1 20%,
            #e3e4e6 40%,
            #e3e4e6 100%
          );
          background-repeat: no-repeat;
          background-size: 800px 104px;
          animation-duration: 1s;
          animation-fill-mode: forwards;
          animation-iteration-count: infinite;
          animation-name: shimmer;
          animation-timing-function: linear;
        }
        @keyframes shimmer {
          0% {
            background-position: -468px 0;
          }

          100% {
            background-position: 468px 0;
          }
        }
      `}</style>
    </div>
  );
}
