const yargs = require("yargs");
const chalk = require("chalk");
const prettyMilliseconds = require("pretty-ms");
const { hideBin } = require("yargs/helpers");
const {
  getCompany,
  allJobs,
  buildUpdatedJobs,
  writeTempCompanyJobs,
  writeJobs,
} = require("@remotebear/data-api");
const { scrapeJobs, createNewJobsDataPullRequest } = require("../src");

const { skipPullRequest, writeLocalData, companyId } = yargs(
  hideBin(process.argv)
)
  .option("company-id", {
    type: "string",
    description: "Run only for a specific company",
  })
  .option("skip-pull-request", {
    type: "boolean",
    description: "Skip the pull-request creation",
  })
  .option("skip-writing", {
    type: "boolean",
    description: "Skip writing the output to jobs-data.json",
  }).argv;

const prettyPrintJob = (job) => {
  const companyName =
    (getCompany(job.company || job.companyId) || {}).name ||
    `${job.companyId} (MISSING)`;
  console.log(`- ${companyName}: ${job.title} ∙ ${job.location}`);
};

(async function () {
  let previousJobs = allJobs;
  if (companyId) {
    previousJobs = previousJobs.filter((job) => job.companyId === companyId);
  }
  console.log(`${previousJobs.length} previous jobs`);

  if (companyId) {
    console.log(`Scraping job updates for ${companyId}...`);
  } else {
    console.log(`Scraping job updates...`);
  }
  const onCompanyScraped = (company, scrapingDuration) => {
    console.log(
      `- ${chalk.green("✓")} Scraping ${company.name} took ${prettyMilliseconds(
        scrapingDuration
      )} (using "${company.scrapingStrategy}" strategy)`
    );
  };
  const onCompanyScrapingFailed = (company, error) => {
    console.error(
      `- ${chalk.red("x")}  Scraping ${company.name} (using "${
        company.scrapingStrategy
      }" strategy) failed: ${error.message}`
    );
  };
  const { scrapedJobs, scrapingErrors, invalidScrapedJobs } = await scrapeJobs({
    companyId,
    onCompanyScraped,
    onCompanyScrapingFailed,
  });
  console.log(`Scraped ${scrapedJobs.length} jobs.`);
  if (Object.keys(scrapingErrors).length) {
    console.log(
      `${Object.keys(scrapingErrors).length} companies couldn't be scraped:`
    );
    Object.entries(scrapingErrors).forEach(([companyId, error]) => {
      console.error(
        `- ${chalk.red("x")} The "${companyId}" scraping failed: ${
          error.message
        }`
      );
    });
  }
  console.log("");

  const { jobs, addedJobs, removedJobs, skippedJobs } = buildUpdatedJobs({
    previousJobs,
    currentJobs: scrapedJobs,
    skippedCompanyIds: Object.keys(scrapingErrors),
  });

  if (addedJobs.length > 0) {
    console.log(`Added ${addedJobs.length} new jobs:`);
    addedJobs.forEach(prettyPrintJob);
  } else {
    console.log("0 new jobs found");
  }
  console.log("");
  if (skippedJobs.length > 0) {
    console.log(
      `Skipped ${skippedJobs.length} jobs because their company couldn't be scraped.`
    );
  } else {
    console.log("0 jobs removed");
  }
  console.log("");
  if (removedJobs.length > 0) {
    console.log(`Removed ${removedJobs.length} jobs:`);
    removedJobs.forEach(prettyPrintJob);
  } else {
    console.log("0 jobs removed");
  }
  console.log("");
  if (invalidScrapedJobs.length > 0) {
    console.log(`Scraped ${invalidScrapedJobs.length} invalid jobs:`);
    invalidScrapedJobs.forEach((job) =>
      console.log(
        `- id: "${job.id}", title: ${job.title}, location: "${job.location}"`
      )
    );
  }
  console.log("");
  const jobsWithInvalidLocation = jobs.filter(
    (job) => !job.normalizedLocation || !job.normalizedLocation.length
  );
  let invalidLocations = [];
  if (jobsWithInvalidLocation.length > 0) {
    invalidLocations = jobsWithInvalidLocation
      .reduce((acc, job) => {
        const existingInvalidLocation = acc.find(
          (x) => x.location === job.location
        );
        if (existingInvalidLocation) {
          existingInvalidLocation.count =
            (existingInvalidLocation.count || 0) + 1;
        } else {
          acc.push({
            location: job.location,
            count: 1,
            companyId: job.companyId,
          });
        }
        return acc;
      }, [])
      .sort((a, b) => b.count - a.count);
    console.log(`There are ${invalidLocations.length} invalid location:`);
    invalidLocations.forEach((job) =>
      console.log(
        `- companyId: "${job.companyId}", location: ${job.location}, count: ${job.count}`
      )
    );
  }
  console.log("");

  if (companyId) {
    console.log("Skipping PR because invoked with --company-id");
    console.log(`Writing temporary jobs-data.${companyId}.temp.json...`);
    writeTempCompanyJobs(companyId, jobs);
    return;
  }
  if (skipPullRequest) {
    console.log("Skipping PR because invoked with --skip-pull-request");
    return;
  }

  if (skipPullRequest) {
    console.log("No need to update the repo");
  }

  if (!writeLocalData && (addedJobs.length > 0 || removedJobs.length > 0)) {
    console.log("Creating pull request...");
    const pullRequest = await createNewJobsDataPullRequest({
      jobs,
      removedJobs,
      addedJobs,
      scrapingErrors,
      invalidLocations,
    });
    console.log(`Created pull request ${pullRequest.data.number}`);
  } else if (writeLocalData && !skipPullRequest) {
    console.log("Writing jobs-data.json...");
    writeJobs(jobs);
    console.log("Updated jobs-data.json");
  } else {
    console.log("No need to update the repo");
  }
})();
