const fetch = require("node-fetch");

async function getJobsFromLever(leverCompanyId) {
  const responseRaw = await fetch(
    `https://api.lever.co/v0/postings/${leverCompanyId}?mode=json`
  );
  const response = await responseRaw.json();
  const data = response.map((jobInfo) => {
    return {
      department: jobInfo.categories.team,
      id: `${jobInfo.id}`,
      title: jobInfo.text,
      url: jobInfo.hostedUrl,
      location: jobInfo.categories.location,
      _updatedAt: new Date(jobInfo.createdAt).getTime(),
    };
  });
  return data;
}

module.exports = {
  getJobsFromLever,
};
