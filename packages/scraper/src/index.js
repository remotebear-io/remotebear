module.exports = {
  scrapeJobs: require("./scrape-jobs").scrapeJobs,
  createNewJobsDataPullRequest: require("./services/github-api")
    .createNewJobsDataPullRequest,
  companyConfigs: require("./company-configs"),
};
