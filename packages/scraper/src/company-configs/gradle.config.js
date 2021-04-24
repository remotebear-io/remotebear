// Gradle is remote-only, but it doesn't specify it in its job offers
function applyPostScrapingCustomizations(job) {
  return {
    ...job,
    location: `Remote - ${job.location}`,
  };
}

module.exports = {
  applyPostScrapingCustomizations,
};
