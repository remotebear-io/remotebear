const { locationIds } = require("@remotebear/data-api");

function extractTitle(job) {
  return job.title.substr(0, job.title.indexOf("(")).trim() || job.title.trim();
}

function extractLocation(job) {
  const regexp = /\(([^)]+)\)/;
  const regexpResult = regexp.exec(job.title);
  const location =
    regexpResult && regexpResult[1]
      ? [regexpResult[1], job.location].join(", ")
      : job.location;
  return location.trim();
}

// Close's remote job offers have the location between parentheses in the
// title.
// E.g.:
// - Customer Success Associate - Americas (100% Remote)
// - Software Engineer - Backend/Python (Americas & European time zones -- 100% Remote)
function applyPostScrapingCustomizations(job) {
  return {
    ...job,
    title: extractTitle(job),
    location: extractLocation(job),
  };
}

function getNormalizedLocation({ location }) {
  const normalizedLocation = [];
  if (location.toLowerCase().includes("americas & european")) {
    normalizedLocation.push(locationIds.eu);
    normalizedLocation.push(locationIds.us);
  } else if (
    location.toLowerCase().includes("americas") ||
    location.toLowerCase().includes("united states")
  ) {
    normalizedLocation.push(locationIds.us);
  } else if (location.toLowerCase().includes("europe")) {
    normalizedLocation.push(locationIds.us);
  }
  return normalizedLocation;
}

module.exports = {
  applyPostScrapingCustomizations,
  getNormalizedLocation,
};
