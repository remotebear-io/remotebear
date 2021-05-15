/* global document */
const { evaluatePage } = require("../services/puppeteer");

async function scrapeJobs() {
  const url = "https://vercel.com/careers";
  const data = await evaluatePage({
    url,
    evaluate: () => {
      return [...document.querySelectorAll(".career-content")].map(
        (jobOfferContainer) => {
          return {
            department: "",
            url: jobOfferContainer.baseURI,
            id: jobOfferContainer.baseURI,
            location: "Remote",
            title: jobOfferContainer.querySelector("h3").textContent.trim(),
            _id: jobOfferContainer.baseURI,
            _updatedAt: Date.now(),
          };
        }
      );
    },
  });
  return data;
}

module.exports = {
  scrapeJobs,
};
