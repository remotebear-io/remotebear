const { locationIds } = require("@remotebear/data-api");

// E.g.:
// - Fully remote (UTC-8 to UTC+5.5)
// - Anywhere
// - Remote
function getNormalizedLocation({ location }) {
  const normalizedLocation = [];
  if (location === "Fully remote (UTC-8 to UTC+5.5)") {
    normalizedLocation.push(locationIds.us);
  }
  return normalizedLocation;
}

module.exports = {
  getNormalizedLocation,
};
