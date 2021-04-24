/* global document */
const { evaluatePage } = require("../services/puppeteer");

function extractLocationFromJobDescription(description) {
  if (description.toLowerCase().includes("europe")) {
    return "Remote - EU";
  }
  return "Remote";
}

async function scrapeJobs() {
  const url = "https://toggl.com/jobs/";
  const data = await evaluatePage({
    url,
    scriptTag: { content: `${extractLocationFromJobDescription}` },
    evaluate: function () {
      const jobLinksPrefix = "https://toggl.com/jobs/";
      const jobLinks = Array.from(document.querySelectorAll("a")).filter(
        (link) =>
          link.href.startsWith(jobLinksPrefix) && link.href !== jobLinksPrefix
      );
      return jobLinks.map((jobLink) => {
        return {
          department: jobLink.parentElement.querySelector("[class*='Title']")
            .textContent,
          url: jobLink.href,
          id: jobLink.href,
          location: extractLocationFromJobDescription(
            jobLink.querySelector("[class*='Description']").textContent
          ),
          title: jobLink.querySelector("[class*='Title']").textContent,
          _id: jobLink.href,
          _updatedAt: Date.now(),
        };
      });
    },
  });
  return data;
}

module.exports = {
  scrapeJobs,
  extractLocationFromJobDescription,
};
