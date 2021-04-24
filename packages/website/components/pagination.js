import { useRouter } from "next/router";
import { getCurrentOrigin } from "lib/utils";
import { Button } from "./buttons";

function buildPaginationHref(pageIndex) {
  const router = useRouter();
  const url = new URL(router.asPath, getCurrentOrigin());
  url.searchParams.set("p", pageIndex || 0);
  return url.href;
}

export default function Pagination({ pagination }) {
  return (
    <div className="flex w-full flex-row items-center justify-center">
      <div className="my-6 flex flex-row justify-between items-center">
        <Button
          className="mx-4"
          disabled={pagination.currentPage === 0}
          href={buildPaginationHref(pagination.previousPage)}
        >
          Prev
        </Button>
        <p className="md:text-lg">
          Showing page{" "}
          <span className="font-medium">{pagination.currentPage + 1}</span> of{" "}
          <span className="font-medium">{pagination.totalPagesCount}</span>
        </p>
        <Button
          className="mx-4"
          disabled={!pagination.nextPage}
          href={buildPaginationHref(pagination.nextPage)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
