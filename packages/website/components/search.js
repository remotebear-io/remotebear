import { useRef, useState } from "react";
// We must import these files directly from the source-dir in order to avoid
// side-effects (namely, importing the entire jobs-data.json file).
import { allLocations } from "@remotebear/data-api/src/locations";
import { allDepartments } from "@remotebear/data-api/src/departments";
import { useDebouncedEffect } from "lib/hooks";
import { isTouchDevice, sanitizeString } from "lib/utils";
import { Button } from "./buttons";
import { Banner } from "./banner";

const queryDebounceDelay = 200;

function sanitizeInput(str) {
  return sanitizeString(str).replace(/^\s+/, "");
}

export default function Search({
  query,
  locationId,
  departmentId,
  onFilterChange,
}) {
  const [internalQuery, setInternalQuery] = useState(query || "");
  const queryInputRef = useRef();
  const handleKeyDown = (e) => {
    if (!isTouchDevice() && e.key === "Enter") {
      e.preventDefault();
    }
  };
  useDebouncedEffect(
    () => {
      onFilterChange("query", internalQuery);
    },
    [internalQuery],
    queryDebounceDelay
  );
  const handleQuerySubmit = (e) => {
    e.preventDefault();
    queryInputRef.current.blur();
  };
  return (
    <div className="mb-6">
      <form
        role="search"
        noValidate
        className="flex md:flex md:flex-row flex-col"
        onSubmit={handleQuerySubmit}
        action="."
      >
        <label className="flex flex-grow relative mr-3 w-full md:w-min">
          <input
            ref={queryInputRef}
            id="search-query"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            maxLength="512"
            className="block w-full pt-1 pb-1 pl-4 pr-8 text-gray-700 border-gray-200 border-2 md:text-lg rounded-md shadow-sm"
            onChange={(event) =>
              setInternalQuery(sanitizeInput(event.target.value))
            }
            value={internalQuery}
            onKeyDown={handleKeyDown}
            type="search"
            name="q"
            required
          />
          <span className="pointer-events-none md:text-lg text-gray-500">
            Search by keywords
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="absolute right-2 bottom-1 text-gray-400 w-5 h-7 md:h-8 pointer-events-none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </label>
        <label className="relative mr-3 w-full md:w-min mt-6 md:mt-0">
          <select
            id="search-department"
            className="block pt-1 pb-1 pl-4 pr-8 text-gray-700 border-gray-200 border-2 md:text-lg rounded-md shadow-sm  w-full md:w-48"
            required
            onChange={(event) =>
              onFilterChange("departmentId", event.target.value)
            }
            value={departmentId}
            name="d"
          >
            <option key="" value="">
              All
            </option>
            {allDepartments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none md:text-lg text-gray-500 bg-white">
            Department
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="absolute right-2 bottom-1 text-gray-400 w-5 h-7 md:h-8 pointer-events-none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </label>
        <label className="relative w-full md:w-min mt-6 md:mt-0">
          <select
            id="search-location"
            className="block pt-1 pb-1 pl-4 pr-8 text-gray-700 border-gray-200 border-2 md:text-lg rounded-md shadow-sm w-full md:w-40"
            required
            onChange={(event) =>
              onFilterChange("locationId", event.target.value)
            }
            value={locationId}
            name="l"
          >
            {allLocations.map((location) => (
              <option
                key={location.id}
                value={location.id === "global" ? "" : location.id}
              >
                {location.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none md:text-lg text-gray-500 bg-white">
            Your location
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="absolute right-2 bottom-1 text-gray-400 w-5 h-7 md:h-8 pointer-events-none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </label>
        <noscript>
          <Button
            type="submit"
            className="w-full md:w-min justify-center md:ml-3 mt-6 md:mt-0 py-1 md:py-1 md:text-lg"
          >
            Search
          </Button>
        </noscript>
        <style jsx>
          {`
            label span {
              position: absolute;
              bottom: 0;
              left: 0;
              display: block;
              transform: translate3d(1rem, -0.4rem, 0);
              transition: 0.1s ease;
            }
            @media (min-width: 768px) {
              label span {
                transform: translate3d(1rem, -0.4rem, 0);
              }
            }
            label:focus-within span,
            input:valid + span,
            select:valid + span {
              transform: scale(0.75) translate3d(-1rem, -2.8rem, 0);
              background-color: transparent;
              width: auto;
              max-width: nonde;
            }
            @media (min-width: 768px) {
              label:focus-within span,
              input:valid + span,
              select:valid + span {
                transform: scale(0.75) translate3d(-1rem, -3.1rem, 0);
              }
            }
            input {
              appearance: none;
            }
            select {
              appearance: none;
              background: white;
            }
            select[required]:invalid {
              color: rgb(107, 114, 128);
            }
          `}
        </style>
      </form>
      <div className="flex flex-row mt-6 js-only">
        {(query || departmentId || locationId) && (
          <div className="flex items-start h-16 md:h-10 wrap flex-wrap">
            <SearchTermBadge
              onClick={() => {
                onFilterChange("query", "");
                setInternalQuery("");
              }}
            >
              {query}
            </SearchTermBadge>
            <SearchTermBadge onClick={() => onFilterChange("departmentId", "")}>
              {departmentId}
            </SearchTermBadge>
            <SearchTermBadge onClick={() => onFilterChange("locationId", "")}>
              {locationId}
            </SearchTermBadge>
          </div>
        )}
        {!query && !departmentId && !locationId && (
          <Banner type="new" className="h-16 md:h-10">
            Search criteria will now be bookmarked.
          </Banner>
        )}
      </div>
    </div>
  );
}

function SearchTermBadge({ children, onClick }) {
  if (!children) {
    return null;
  }
  return (
    <button
      onClick={onClick}
      className="flex rounded-md bg-blue-100  px-2 py-1 text-sm font-medium mr-3 items-center mb-2 text-blue-700 hover:opacity-70"
    >
      {children}{" "}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="fill-current h-4 w-4 text-blue-700 ml-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}
