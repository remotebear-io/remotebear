const { locationIds } = require("@remotebear/data-api");

const usLocations = ["usa", "atlanta", "san francisco"];
const canadaLocations = ["canada"];

// Fullstory seems to be US/Canada only but it uses different variations of the
// terms US/Atlanta/Canada, etc... in its location so we need to account for it here.
// E.g.:
// - Atlanta, GA or Remote (USA or Canada)
// - Remote, San Francisco Bay Area
// - Atlanta, GA or Remote
function getNormalizedLocation({ location }) {
  const normalizedLocation = [];

  if (
    usLocations.some((usLocations) =>
      location.toLowerCase().includes(usLocations)
    )
  ) {
    normalizedLocation.push(locationIds.us);
  }

  if (
    canadaLocations.some((canadaLocation) =>
      location.toLowerCase().includes(canadaLocation)
    )
  ) {
    normalizedLocation.push(locationIds.canada);
  }

  if (!normalizedLocation.length) {
    // Default to remote US only
    normalizedLocation.push(locationIds.us);
  }

  return normalizedLocation;
}

module.exports = {
  getNormalizedLocation,
};
