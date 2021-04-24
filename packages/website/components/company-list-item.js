import Image from "next/image";
import Link from "next/link";
import { Underline } from "./underline";

export default function CompanyListItem({ company, recentlyAdded }) {
  return (
    <>
      <Link href={`/companies/${company.id}`}>
        <a className="flex flex-col flex-p-2 mb-8">
          <div className="flex flex-row justify-between mb-2 cursor-pointer">
            <Underline
              color={recentlyAdded ? undefined : "#d9f1f1"}
              height="0.5rem"
              bottom="-0rem"
              left="-0.4rem"
              right="-0.6rem"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div className="w-8 h-8 relative">
                <Image
                  alt={`${company.name} logo`}
                  src={company.logoUrl}
                  className="rounded-sm z-10"
                  layout="fill"
                />
                {recentlyAdded && (
                  <div className="absolute -left-5 -top-6">
                    <div className="absolute new-bg bg-yellow-400 h-full w-full top-0" />
                    <div className="text-xs font-bold text-white px-2 py-1 relative">
                      NEW
                    </div>
                  </div>
                )}
              </div>
              <span className="ml-2 font-medium text-lg md:text-xl asdf">
                {company.name}
              </span>
            </Underline>
            {company.jobsCount ? (
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 self-center">
                {company.jobsCount} remote positions{" "}
              </span>
            ) : (
              <span className="text-xs font-medium text-red-700 bg-red-50 px-2 py-1 self-center">
                No remote positions
              </span>
            )}
          </div>
          <span className="text-gray-700 md:text-lg mb-2">
            {company.description}
          </span>
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
            top: -6px;
            bottom: 4px;
            left: -18px;
            right: -18px;
            z-index: -1;
            background: #f9fafb;
            border: 1px solid #f3f4f6;
          }
        }
        .new-bg {
          transform: rotate(-1deg) skewX(-12deg);
        }
      `}</style>
    </>
  );
}
