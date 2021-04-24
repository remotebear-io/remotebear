const { locationIds } = require("@remotebear/data-api");
const { locationLooselyIncludes } = require("@remotebear/normalizer");

function getNormalizedLocation({ location }) {
  const normalizedLocation = [];
  if (locationLooselyIncludes(location, ["remote us", "remoteus"])) {
    normalizedLocation.push(locationIds.us);
  }
  if (locationLooselyIncludes(location, ["remote eu", "remoteeu"])) {
    normalizedLocation.push(locationIds.eu);
  }
  if (
    locationLooselyIncludes(location, [
      "remote rest of world",
      "remoterest of world",
    ])
  ) {
    normalizedLocation.push(locationIds.eu);
    normalizedLocation.push(locationIds.other);
  }
  return normalizedLocation;
}

module.exports = {
  getNormalizedLocation,
};
