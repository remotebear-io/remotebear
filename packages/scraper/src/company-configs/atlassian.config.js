const { locationIds } = require("@remotebear/data-api");
const { locationLooselyIncludes } = require("@remotebear/normalizer");

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

// Sometimes Atlassian job offers have the location between parentheses in the
// title.
// E.g.: Senior Engineering Manager, Bitbucket Cloud (Austin or Remote)
function applyPostScrapingCustomizations(job) {
  return {
    ...job,
    title: extractTitle(job),
    location: extractLocation(job),
  };
}

function getNormalizedLocation({ location }) {
  const normalizedLocation = [];
  if (
    locationLooselyIncludes(location, [
      "remote within poland",
      "remote gdansk poland",
      "remote germany",
      "remote amsterdam",
      "remote uk",
    ])
  ) {
    normalizedLocation.push(locationIds.eu);
  } else {
    // Default to use
    normalizedLocation.push(locationIds.us);
  }
  return normalizedLocation;
}

module.exports = {
  applyPostScrapingCustomizations,
  getNormalizedLocation,
};
