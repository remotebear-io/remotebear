function extractTitle(job) {
  return (
    job.title.substr(0, job.title.indexOf("(")).trim() || job.title.trim()
  ).replace('"', "");
}

function extractLocation(job) {
  const regexp = /\(([^)]+)\)/;
  const regexpResult = regexp.exec(job.title);
  const location =
    regexpResult && regexpResult[1] ? regexpResult[1] : job.location;
  return location.replace(/Remote Eligible/gi, "Remote").trim();
}

// Spotify job offers have the location between parentheses in the title.
// Also, sometimes they're wrapped in double quotes.
// E.g.:
// - Senior Data Scientist (Remote Eligible - Americas)
// - Open Source Tech Lead - Platform “(Remote Eligible - Americas)”
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
