const { locationIds } = require("@remotebear/data-api");
const { locationLooselyStartsWith } = require("@remotebear/normalizer");

function getNormalizedLocation({ location }) {
  const normalizedLocation = [];
  if (locationLooselyStartsWith(location, "united states")) {
    normalizedLocation.push(locationIds.us);
  }
  return normalizedLocation;
}

module.exports = {
  getNormalizedLocation,
};
