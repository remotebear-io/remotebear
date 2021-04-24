function extractTitle(job) {
  return job.title.replace(/\(Remote\)/, "").trim();
}

// Sometimes Wirecutter job offers have the location between parentheses in the
// title.
// E.g.: Engineering Manager, Wirecutter (Remote)
function applyPostScrapingCustomizations(job) {
  return {
    ...job,
    title: extractTitle(job),
  };
}

module.exports = {
  applyPostScrapingCustomizations,
};
