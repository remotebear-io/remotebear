const fetch = require("node-fetch");

async function fetchJobsFromSmartrecruiters(params = {}) {
  const { companyId, limit = 100, offset = 0 } = params;
  const responseRaw = await fetch(
    `https://api.smartrecruiters.com/v1/companies/${companyId}/postings?limit=${limit}&offset=${offset}`
  );
  return responseRaw.json();
}

async function getJobsFromSmartrecruiters(
  smartrecruitersCompanyId,
  params = {}
) {
  const { limit = 100 } = params;
  let currentOffset = 0;
  let didCompleteFetching = false;
  let jobs = [];
  while (!didCompleteFetching) {
    const response = await fetchJobsFromSmartrecruiters({
      companyId: smartrecruitersCompanyId,
      offset: currentOffset,
      limit: limit,
    });
    jobs = [...jobs, ...response.content];
    currentOffset = currentOffset += limit;
    if (response.totalFound < currentOffset) {
      didCompleteFetching = true;
    }
  }
  const data = jobs.map((job) => {
    const { country, remote } = job.location;

    return {
      department: job.department.label,
      url: `https://jobs.smartrecruiters.com/${job.company.identifier}/${job.id}`,
      id: `${job.id}`,
      title: job.name,
      location: remote
        ? `Remote ${country.toUpperCase()}`
        : country.toUpperCase(),
      _id: job.id,
      _updatedAt: new Date(job.releasedDate).getTime(),
    };
  });
  return data;
}

module.exports = {
  getJobsFromSmartrecruiters,
};
