const { locationIds } = require("@remotebear/data-api");

// Airtable is US only
function getNormalizedLocation() {
  const normalizedLocation = [];
  normalizedLocation.push(locationIds.us);
  return normalizedLocation;
}

module.exports = {
  getNormalizedLocation,
};
