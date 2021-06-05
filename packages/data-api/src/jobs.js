const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const jobsData = require("@remotebear/data/jobs/jobs-data.json");

function writeJobs(jobs) {
  fs.writeFileSync(
    path.resolve(__dirname, "../../data/jobs/jobs-data.json"),
    prettier.format(JSON.stringify(jobs), {
      printWidth: 1000,
      parser: "json",
    })
  );
}

function getTempCompanyJobsPath(companyId) {
  return `../../data/jobs/jobs-data.${companyId}.temp.json`;
}

function getTempCompanyJobs(companyId) {
  return require(getTempCompanyJobsPath(companyId));
}

function writeTempCompanyJobs(companyId, jobs) {
  fs.writeFileSync(
    path.resolve(__dirname, getTempCompanyJobsPath(companyId)),
    JSON.stringify(jobs)
  );
}

function buildUpdatedJobs({ previousJobs, currentJobs, skippedCompanyIds }) {
  const removedJobs = previousJobs.filter((previousJob) => {
    if (skippedCompanyIds.includes(previousJob.companyId)) {
      return false;
    }
    const currentJobIds = currentJobs.map((currentJob) => currentJob.id);
    return !currentJobIds.includes(previousJob.id);
  });
  const addedJobs = [];
  const previousJobsFromSkippedCompanies = previousJobs.filter((job) =>
    skippedCompanyIds.includes(job.companyId)
  );
  const jobs = currentJobs
    .map((currentJob) => {
      const previousJob = previousJobs.find(
        (previousJob) => currentJob.id === previousJob.id
      );
      const job = {
        ...currentJob,
        createdAt:
          (previousJob && previousJob.createdAt) ||
          currentJob._updatedAt ||
          Date.now(),
      };
      if (!previousJob) {
        addedJobs.push(job);
      }
      return job;
    })
    .concat(previousJobsFromSkippedCompanies)
    .sort((a, b) => {
      // Sort jobs by "createdAt" and eventually "id"
      if (a.createdAt !== b.createdAt) {
        return a.createdAt < b.createdAt ? 1 : -1;
      }
      return a.id < b.id ? 1 : -1;
    });
  return {
    jobs,
    removedJobs,
    addedJobs,
    skippedJobs: previousJobsFromSkippedCompanies,
  };
}

module.exports = {
  allJobs: jobsData,
  writeJobs,
  getTempCompanyJobs,
  writeTempCompanyJobs,
  buildUpdatedJobs,
  jobsFilePath: "packages/data/jobs/jobs-data.json",
  jobsHistoryDir: "packages/data/jobs-history",
};
