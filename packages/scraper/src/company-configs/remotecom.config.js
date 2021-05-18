// Remote.com has only full-remote positions (with a "Anywhere" location)
function extractLocation() {
  return "Remote";
}

function applyPostScrapingCustomizations(job) {
  return {
    ...job,
    location: extractLocation(job),
  };
}

module.exports = {
  applyPostScrapingCustomizations,
};
