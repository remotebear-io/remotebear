const { locationIds } = require("@remotebear/data-api");
const { locationLooselyIncludes } = require("@remotebear/normalizer");

// CircleCI has the remote location between parenthesis in the location
// E.g.:
// - Remote (United States (East Coast), Canada (East Coast),Ireland, Germany or United Kingdom), Boston, Toronto, London
// - Remote (United States, Canada, United Kingdom, Ireland or Germany)
function getNormalizedLocation({ location }) {
  const normalizedLocation = [];
  const remoteLocationMatchResult = location.match(new RegExp("\\((.*)\\)"));
  const remoteLocation =
    remoteLocationMatchResult && remoteLocationMatchResult[1];
  if (!remoteLocation) {
    return normalizedLocation;
  }
  if (
    locationLooselyIncludes(remoteLocation, ["united states", "east coast"])
  ) {
    normalizedLocation.push(locationIds.us);
  }
  if (locationLooselyIncludes(remoteLocation, ["canada"])) {
    normalizedLocation.push(locationIds.canada);
  }
  if (
    locationLooselyIncludes(remoteLocation, [
      "united kingdom",
      "ireland",
      "germany",
    ])
  ) {
    normalizedLocation.push(locationIds.eu);
  }
  if (locationLooselyIncludes(remoteLocation, ["japan"])) {
    normalizedLocation.push(locationIds.other);
  }
  return normalizedLocation;
}

module.exports = {
  getNormalizedLocation,
};
