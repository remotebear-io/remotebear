const { locationIds } = require("@remotebear/data-api");
const { locationKeywordsLooselyMatch } = require("@remotebear/normalizer");

// Digialocean locations often look like this
// - Remote: U.S. & Canada or Office Locations: Cambridge - MA, New York - NY, Palo Alto - CA
// - Remote: U.S. & Canada
// - Remote: U.S. or Office Locations: Cambridge - MA, New York - NY, Palo Alto - CA
// So we can check in advance if they start with a specific pattern.
function getNormalizedLocation({ location }) {
  const normalizedLocation = [];
  if (location.includes("Remote - Global")) {
    normalizedLocation.push(locationIds.global);
    return normalizedLocation;
  }
  const firstPartOfLocation = location.split(" or")[0];
  if (locationKeywordsLooselyMatch(firstPartOfLocation, ["remote us"])) {
    normalizedLocation.push(locationIds.us);
  }
  if (locationKeywordsLooselyMatch(firstPartOfLocation, ["remote us canada"])) {
    normalizedLocation.push(locationIds.canada);
    normalizedLocation.push(locationIds.us);
  }
  return normalizedLocation;
}

module.exports = {
  getNormalizedLocation,
};
