const fetch = require("node-fetch");

async function getJobsFromWorkable(workableCompanyId) {
  const responseRaw = await fetch(
    `https://apply.workable.com/api/v3/accounts/${workableCompanyId}/jobs`,
    { method: "POST" }
  );
  const response = await responseRaw.json();
  const data = response.results.map((jobInfo) => {
    return {
      department: jobInfo.department && jobInfo.department[0],
      url: `https://apply.workable.com/${workableCompanyId}/j/${jobInfo.id}/`,
      id: `${jobInfo.id}`,
      location: jobInfo.remote ? "Remote" : jobInfo.location.country,
      title: jobInfo.title,
      _updatedAt: new Date(jobInfo.published).getTime(),
    };
  });
  return data;
}

module.exports = {
  getJobsFromWorkable,
};
