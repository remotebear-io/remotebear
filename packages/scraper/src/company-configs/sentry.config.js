const fetch = require("node-fetch");
const { locationIds } = require("@remotebear/data-api");

// We need a light variation of the Greenhouse strategy in order to fetch
// the offices as well, because Discord keeps the "remote" info in the office
// names... which are not fetched by default with our standard strategy.
async function scrapeJobs() {
  const responseRaw = await fetch(
    `https://api.greenhouse.io/v1/boards/sentry/embed/offices`
  );
  const response = await responseRaw.json();
  const data = response.offices
    .filter((office) => office.name.toLowerCase().includes("remote"))
    .flatMap((office) => {
      return office.departments.flatMap((department) => {
        return department.jobs.map((jobInfo) => {
          return {
            department: department.name,
            url: jobInfo.absolute_url,
            id: `${jobInfo.id}`,
            location: office.name,
            title: jobInfo.title,
            _id: jobInfo.internal_job_id,
            _updatedAt: new Date(jobInfo.updated_at).getTime(),
          };
        });
      });
    });
  return data;
}

const defaultGlobalLocation = locationIds.us;

module.exports = {
  scrapeJobs,
  defaultGlobalLocation,
};
