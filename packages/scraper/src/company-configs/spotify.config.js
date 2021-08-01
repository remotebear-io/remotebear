const fetch = require("node-fetch");

async function scrapeJobs() {
  const websiteJobsRaw = await fetch(
    "https://api-dot-new-spotifyjobs-com.nw.r.appspot.com/wp-json/animal/v1/job/search"
  );
  const { result: websiteJobs } = await websiteJobsRaw.json();
  const data = websiteJobs
    .filter((websiteJob) => websiteJob.is_remote)
    .map((websiteJob) => {
      return {
        department: websiteJob.main_category.name,
        url: `https://www.spotifyjobs.com/jobs/${websiteJob.id}`,
        title: websiteJob.text,
        location: websiteJob.remote_name && websiteJob.remote_name.name,
        id: `https://www.spotifyjobs.com/jobs/${websiteJob.id}`,
        _id: websiteJob.id,
        _updatedAt: Date.now(),
      };
    });
  return data;
}

module.exports = {
  scrapeJobs,
};
