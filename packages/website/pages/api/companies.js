import path from "path";
import { allCompanies, allJobs } from "@remotebear/data-api";
import { getImmutablePublicAssets } from "lib/api";
import { sanitizeString } from "lib/utils";

const oneHourInSeconds = 60 * 60;
const companyLogoPathsByCompanyIds = getImmutablePublicAssets(
  path.resolve("./public", "company-logos")
);

const jobsCountByCompanyId = allCompanies.reduce((acc, company) => {
  acc[company.id] =
    allJobs.filter((job) => job.companyId === company.id)?.length || 0;
  return acc;
}, {});

function parseNumberOfEmployesEnum(numberOfEmployesEnum) {
  if (!numberOfEmployesEnum || typeof numberOfEmployesEnum !== "string") {
    return [0, 0];
  }
  const [, lowerBound, upperBound] = numberOfEmployesEnum.split("_");
  return [Number(lowerBound), Number(upperBound)];
}

export function getCompanies(companyId) {
  const companies = allCompanies
    .filter((company) => (companyId ? company.id === companyId : true))
    .filter((company) => company.status === "enabled")
    .map((company) => {
      const logoName = companyLogoPathsByCompanyIds[company.id];
      const logoUrl = `/company-logos/${logoName}`;
      const data = {
        id: company.id,
        name: company.name,
        url: company.url,
        description: company.crunchbaseMeta?.description,
        jobsCount: jobsCountByCompanyId[company.id],
        createdAt: company.createdAt || null,
        logoUrl,
      };
      if (companyId) {
        data.numberOfEmployes = parseNumberOfEmployesEnum(
          company.crunchbaseMeta.numberOfEmployesEnum
        );
      }
      return data;
    });
  return companyId ? companies?.[0] : companies;
}

export default (req, res) => {
  const companyId = sanitizeString(req.query?.cid || "");
  const items = getCompanies(companyId);
  res.statusCode = 200;
  res.setHeader(
    "Cache-Control",
    `s-maxage=${oneHourInSeconds}, stale-while-revalidate`
  );
  res.json(JSON.stringify({ items }));
};
