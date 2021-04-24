const fetch = require("node-fetch");
/** @see https://docs.recruitee.com/reference#offers-1 */
async function getJobsFromRecruitee(recruiteeCompanyId) {
  const responseRaw = await fetch(
    `https://${recruiteeCompanyId}.recruitee.com/api/offers`
  );
  const response = await responseRaw.json();
  const data = response.offers.map((jobInfo) => ({
    department: jobInfo.department,
    url: jobInfo.careers_url,
    id: `${jobInfo.id}`,
    location: jobInfo.remote ? "Remote" : jobInfo.location,
    title: jobInfo.title,
    _updatedAt: new Date(jobInfo.created_at).getTime(),
  }));
  return data;
}

module.exports = {
  getJobsFromRecruitee,
};
