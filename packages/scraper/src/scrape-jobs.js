const { allCompanies } = require("@remotebear/data-api");
const puppeteerService = require("./services/puppeteer");
const {
  getNormalizedLocation,
  getNormalizedDepartment,
} = require("@remotebear/normalizer");
const companyConfigs = require("./company-configs");
const { getJobsFromGreenhouse } = require("./strategies/greenhouse-strategy");
const { getJobsFromLever } = require("./strategies/lever-strategy");
const { getJobsFromWorkable } = require("./strategies/workable-strategy");
const { getJobsFromRecruitee } = require("./strategies/recruitee-strategy");
const { getJobsFromPersonio } = require("./strategies/personio-strategy");
const { getJobsFromWorkday } = require("./strategies/workday-strategy");
const {
  getJobsFromSmartrecruiters,
} = require("./strategies/smartrecruiters-strategy");

function applyPostScrapingCustomizations(job) {
  const jobCompanyConfig = companyConfigs[job.companyId];
  if (jobCompanyConfig && jobCompanyConfig.applyPostScrapingCustomizations) {
    return jobCompanyConfig.applyPostScrapingCustomizations(job);
  }
  return job;
}

function setNormalizedLocation(job) {
  return {
    ...job,
    normalizedLocation: getNormalizedLocation(job),
  };
}

function setNormalizedDepartment(job) {
  return {
    ...job,
    normalizedDepartment: getNormalizedDepartment(job),
  };
}

function isValidJob(job) {
  if (!job.title || !job.location) {
    return false;
  }
  // CircleCI has a job like this, lol
  if (job.title.includes("Are you not able to find what you're looking for")) {
    return false;
  }
  return true;
}

function isRemote(job) {
  return job.location && job.location.toLowerCase().includes("remote");
}

function sanitizeJob(job) {
  return {
    ...job,
    department: (job.department || "").trim(),
    location:
      job.location === "REMOTE" || job.location === "Remote, Remote"
        ? "Remote"
        : job.location.trim(),
    title: job.title.trim(),
  };
}

function addCompanyId(job, companyId) {
  return {
    ...job,
    companyId,
    id: `${companyId}_${job.id}`,
  };
}

async function scrapeJobs({
  companyId,
  onCompanyScraped = () => {},
  onCompanyScrapingFailed = () => {},
} = {}) {
  await puppeteerService.initialize();
  const scrapingTimings = [];
  const scrapingErrors = {};
  const invalidScrapedJobs = [];
  const companyJobRunnerPromises = allCompanies
    .filter((company) =>
      companyId ? company.id === companyId : company.status === "enabled"
    )
    .map(async (company) => {
      const startTime = Date.now();
      let jobs = [];
      let scrapingError;
      try {
        if (company.scrapingStrategy === "greenhouse") {
          jobs = await getJobsFromGreenhouse(company.scrapingConfig.id);
        } else if (company.scrapingStrategy === "lever") {
          jobs = await getJobsFromLever(company.scrapingConfig.id);
        } else if (company.scrapingStrategy === "workable") {
          jobs = await getJobsFromWorkable(company.scrapingConfig.id);
        } else if (company.scrapingStrategy === "recruitee") {
          jobs = await getJobsFromRecruitee(company.scrapingConfig.id);
        } else if (company.scrapingStrategy === "personio") {
          jobs = await getJobsFromPersonio(
            company.scrapingConfig.version,
            company.scrapingConfig.id
          );
        } else if (company.scrapingStrategy === "smartrecruiters") {
          jobs = await getJobsFromSmartrecruiters(company.scrapingConfig.id);
        } else if (company.scrapingStrategy === "workday") {
          jobs = await getJobsFromWorkday(company.scrapingConfig.url);
        } else if (company.scrapingStrategy === "custom") {
          jobs = await companyConfigs[company.id].scrapeJobs();
        }
      } catch (err) {
        scrapingError = err;
        scrapingErrors[company.id] = err;
      }
      if (scrapingError) {
        onCompanyScrapingFailed(company, scrapingError);
      }
      jobs = jobs.map((job) => addCompanyId(job, company.id));
      const endTime = Date.now();
      scrapingTimings.push([company, endTime - startTime]);
      onCompanyScraped(company, endTime - startTime);
      return jobs;
    });

  const scrapedJobs = (await Promise.all(companyJobRunnerPromises))
    .flat()
    .map(applyPostScrapingCustomizations)
    .filter(isRemote)
    .filter((job) => {
      if (!isValidJob(job)) {
        invalidScrapedJobs.push(job);
        return false;
      }
      return true;
    })
    .map(setNormalizedLocation)
    .map(setNormalizedDepartment)
    .map(sanitizeJob);

  await puppeteerService.teardown();

  return { scrapedJobs, scrapingTimings, scrapingErrors, invalidScrapedJobs };
}

module.exports = {
  scrapeJobs,
};
