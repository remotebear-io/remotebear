function extractTitle(job) {
  return job.title.substr(0, job.title.indexOf("(")).trim() || job.title.trim();
}

function extractLocation(job) {
  const regexp = /\(([^)]+)\)/;
  const regexpResult = regexp.exec(job.title);
  const location =
    regexpResult && regexpResult[1] ? regexpResult[1] : job.location;
  return location.trim();
}

// Sometimes Shopify job offers have the location between parentheses in the
// title.
// E.g.: Senior Data Scientist (Europe - Remote)
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
