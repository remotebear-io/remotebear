function extractTitle(job) {
  return job.title.substr(0, job.title.indexOf("(")).trim();
}
function extractLocation(job) {
  const regexp = /\(([^)]+)\)/;
  return regexp.exec(job.title)[1].trim();
}

// Linear keeps the location info in the job title.
// E.g.:
// - Senior Product Designer (Remote US/EU Timezones)
// - Chief of Staff (Remote US Timezones)
function applyPostScrapingCustomizations(job) {
  return {
    ...job,
    title: extractTitle(job),
    location: extractLocation(job),
  };
}

module.exports = {
  applyPostScrapingCustomizations,
};
