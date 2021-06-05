const { locationIds } = require("@remotebear/data-api");
const { locationLooselyIncludes } = require("@remotebear/normalizer");

// CircleCI has the remote location between parenthesis or comma-separated in the location
// E.g.:
// - Remote (United States (East Coast), Canada (East Coast),Ireland, Germany or United Kingdom), Boston, Toronto, London
// - Remote (United States, Canada, United Kingdom, Ireland or Germany)
// - San Francisco, Denver, Boston, Toronto, Remote US, Remote Canada
function getNormalizedLocation({ location }) {
  const normalizedLocation = [];
  // Parenthesis flow
  const remoteLocationMatchResult = location.match(new RegExp("\\((.*)\\)"));
  if (remoteLocationMatchResult && remoteLocationMatchResult[1]) {
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
  }
  // Comma-separated flow
  else {
    const remoteLocations = location
      .split(/[-,;]/) // Split by these characters
      .map((x) => x.trim().toLowerCase())
      .filter((x) => x.startsWith("remote")) // Pick only locations that starts by "remote"
      .map((x) => x.replace(/Remote /gi, "")); // Remove the "remote" word
    if (remoteLocations.includes("us")) {
      normalizedLocation.push(locationIds.us);
    }
    if (remoteLocations.includes("canada")) {
      normalizedLocation.push(locationIds.canada);
    }
    if (
      remoteLocations.includes("eu") ||
      remoteLocations.includes("ireland") ||
      remoteLocations.includes("germany") ||
      remoteLocations.includes("uk")
    ) {
      normalizedLocation.push(locationIds.eu);
    }
  }
  return normalizedLocation;
}

module.exports = {
  getNormalizedLocation,
};
