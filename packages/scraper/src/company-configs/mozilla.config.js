const { locationIds } = require("@remotebear/data-api");
const { locationLooselyIncludes } = require("@remotebear/normalizer");

// Sometimes Mozilla job offers have internal location mappings
// E.g.: Remote US(2) & (3)
function applyPostScrapingCustomizations(job) {
  return {
    ...job,
    location: job.location.replace(/[()\d&]/g, "").trim(),
  };
}

function getNormalizedLocation({ location }) {
  const normalizedLocation = [];
  if (locationLooselyIncludes(location, ["remote us"])) {
    normalizedLocation.push(locationIds.us);
  }
  if (locationLooselyIncludes(location, ["remote canada"])) {
    normalizedLocation.push(locationIds.canada);
  }
  if (locationLooselyIncludes(location, ["remote germany", "remote uk"])) {
    normalizedLocation.push(locationIds.eu);
  }
  return normalizedLocation;
}

module.exports = {
  applyPostScrapingCustomizations,
  getNormalizedLocation,
};
