import path from "path";
import { isToday, isYesterday, formatDistanceToNow } from "date-fns";
import { jobsPerPage } from "config/config";
import {
  allCompaniesById,
  departmentIds,
  allJobs,
  locationIds,
} from "@remotebear/data-api";
import { getImmutablePublicAssets, paginateItems } from "lib/api";
import { sanitizeString } from "lib/utils";

const oneHourInSeconds = 60 * 60;
const companyFaviconPathsByCompanyIds = getImmutablePublicAssets(
  path.resolve("./public", "company-favicons")
);

function searchInString(string, query) {
  if (!string) {
    return false;
  }
  const stringKeywords = string.toLowerCase().split(/[,-\s]+/);
  const queryKeywords = query.toLowerCase().split(/[,-\s]+/);
  return queryKeywords.every((queryKeyword) =>
    stringKeywords.some((stringKeyword) => stringKeyword.includes(queryKeyword))
  );
}

export function getJobs({ query, locationId, departmentId, companyId }) {
  return allJobs
    .filter((job) => {
      const company = allCompaniesById[job.companyId];
      let satisfiesQuery = true;
      if (query) {
        satisfiesQuery =
          searchInString(job.title, query) ||
          searchInString(job.location, query) ||
          searchInString(company.name, query);
      }
      let satisfiesLocationId = true;
      if (!job.normalizedLocation.length) {
        satisfiesLocationId = false;
      } else if (locationId) {
        satisfiesLocationId =
          job.normalizedLocation.includes(locationIds.global) ||
          job.normalizedLocation.includes(locationId);
      }
      let satisfiesDepartmentId = true;
      if (departmentId) {
        satisfiesDepartmentId =
          departmentId === departmentIds.engineering
            ? job.normalizedDepartment === departmentId
            : !job.normalizedDepartment;
      }
      let satisfiesCompanyId = true;
      if (companyId) {
        satisfiesCompanyId = job.companyId === companyId;
      }
      return (
        satisfiesQuery &&
        satisfiesLocationId &&
        satisfiesDepartmentId &&
        satisfiesCompanyId
      );
    })
    .map((job) => {
      // Add a new "formattedCreatedAt" field holding a human readable date
      let formattedCreatedAt;
      if (isToday(job.createdAt)) {
        formattedCreatedAt = "Today";
      } else if (isYesterday(job.createdAt)) {
        formattedCreatedAt = "Yesterday";
      } else {
        formattedCreatedAt = formatDistanceToNow(job.createdAt, {
          addSuffix: true,
        });
      }
      // Capitalize
      formattedCreatedAt = `${formattedCreatedAt
        .charAt(0)
        .toUpperCase()}${formattedCreatedAt.slice(1)}`;

      // Denormalize the company infos into "company" to avoid loading them
      // on the client side
      const iconName = companyFaviconPathsByCompanyIds[job.companyId];
      const company = {
        id: allCompaniesById[job.companyId].id,
        name: allCompaniesById[job.companyId].name,
        iconUrl: `/company-favicons/${iconName}`,
      };
      return { ...job, company, formattedCreatedAt };
    });
}

export default (req, res) => {
  const q = sanitizeString(req.query?.q || "").trim();
  const l = sanitizeString(req.query?.l || "").trim();
  const d = sanitizeString(req.query?.d || "").trim();
  const p = sanitizeString(req.query?.p || "").trim();
  const cid = sanitizeString(req.query?.cid || "");
  const allItems = getJobs({
    query: q,
    locationId: l,
    departmentId: d,
    companyId: cid,
  });
  const result = paginateItems(allItems, Number(p || "0"), jobsPerPage);
  res.statusCode = 200;
  res.setHeader(
    "Cache-Control",
    `s-maxage=${oneHourInSeconds}, stale-while-revalidate`
  );
  res.json(JSON.stringify(result));
};
