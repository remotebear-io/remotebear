import fs from "fs";

function extractIdFromHashedFilename(filename) {
  // TODO: Allow non-images
  const matchResult = filename.match(/^([\w][\w-]*)\.[a-fA-F0-9]{10}\.png$/);
  return matchResult?.[1];
}

export function getImmutablePublicAssets(path) {
  return fs.readdirSync(path).reduce((acc, filename) => {
    const companyId = extractIdFromHashedFilename(filename);
    if (companyId) {
      acc[companyId] = filename;
    }
    return acc;
  }, {});
}

export function paginateItems(allItems, currentPage = 0, itemsPerPage) {
  const totalItemsCount = allItems.length;
  const totalPagesCount = Math.ceil(allItems.length / itemsPerPage);
  const firstPage = 0;
  const lastPage = totalPagesCount - 1;
  const previousPage = currentPage > 0 ? currentPage - 1 : null;
  const nextPage = currentPage < lastPage ? currentPage + 1 : null;
  const items = allItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const currentPageItemsCount = nextPage
    ? itemsPerPage
    : items.length % itemsPerPage;
  return {
    items,
    pagination: {
      itemsPerPage,
      currentPage,
      currentPageItemsCount,
      totalItemsCount,
      totalPagesCount,
      firstPage,
      lastPage,
      previousPage,
      nextPage,
    },
  };
}
